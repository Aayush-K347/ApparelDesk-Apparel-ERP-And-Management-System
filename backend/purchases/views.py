from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.db import transaction, connection
from django.utils import timezone
from accounts.models import Contact
from catalog.models import Product
from .models import PurchaseOrder, VendorBill, PurchaseOrderLine
from payments.models import Payment, PaymentAllocation
from .serializers import (
    PurchaseOrderSerializer,
    VendorBillSerializer,
    PurchaseOrderCreateSerializer,
)


class PurchaseOrderListView(generics.ListAPIView):
    serializer_class = PurchaseOrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        vendor_id = self.request.query_params.get("vendor_id")
        qs = PurchaseOrder.objects.all().order_by("-created_at")
        if vendor_id:
            qs = qs.filter(vendor_id=vendor_id)
        return qs


class PurchaseOrderCreateView(generics.GenericAPIView):
    serializer_class = PurchaseOrderCreateSerializer
    permission_classes = [AllowAny]  # user requested no auth block

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        try:
            vendor = Contact.objects.get(contact_id=data["vendor_id"])
            order_date = data.get("order_date") or timezone.now().date()
            expected_date = data.get("expected_delivery_date") or None
            po_number = f"PO-{PurchaseOrder.objects.count() + 1:05d}"
            po = PurchaseOrder.objects.create(
                po_number=po_number,
                vendor=vendor,
                order_date=order_date,
                expected_delivery_date=expected_date,
                po_status="draft",
                notes=data.get("notes") or "",
            )

            subtotal = 0
            tax_total = 0
            insert_rows = []
            for idx, line in enumerate(data["lines"], start=1):
                prod = None
                pid = line.get("product_id")
                if pid:
                    prod = Product.objects.filter(pk=pid).first()
                if not prod:
                    # create placeholder product
                    name = line.get("product_name") or f"PO Item {idx}"
                    code = f"PO-AUTO-{po.purchase_order_id}-{idx}"
                    prod = Product.objects.create(
                        product_name=name,
                        product_code=code,
                        product_category="unisex",
                        product_type="other",
                        sales_price=line["unit_price"],
                        purchase_price=line["unit_price"],
                    )
                qty = line["quantity"]
                price = line["unit_price"]
                tax_pct = line.get("tax_percentage") or 0
                line_sub = qty * price
                line_tax = line_sub * tax_pct / 100
                subtotal += line_sub
                tax_total += line_tax
                insert_rows.append(
                    (
                        po.purchase_order_id,
                        prod.product_id,
                        idx,
                        qty,
                        price,
                        tax_pct,
                        0,  # received_quantity
                    )
                )

            # Avoid writing generated columns (line_subtotal, line_tax_amount, line_total)
            with connection.cursor() as cursor:
                cursor.executemany(
                    """
                    INSERT INTO purchase_order_lines
                    (purchase_order_id, product_id, line_number, quantity, unit_price, tax_percentage, received_quantity)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """,
                    insert_rows,
                )
            po.subtotal = subtotal
            po.tax_amount = tax_total
            po.total_amount = subtotal + tax_total
            po.save(update_fields=["subtotal", "tax_amount", "total_amount"])
            return Response(PurchaseOrderSerializer(po).data, status=status.HTTP_201_CREATED)
        except Exception as exc:  # defensive: surface as 400 instead of 500
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)


class VendorBillListView(generics.ListAPIView):
    serializer_class = VendorBillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        vendor_id = self.request.query_params.get("vendor_id")
        qs = VendorBill.objects.select_related("vendor", "purchase_order").order_by("-created_at")
        if vendor_id:
            qs = qs.filter(vendor_id=vendor_id)
        return qs


class VendorListView(generics.ListAPIView):
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        vendors = Contact.objects.filter(contact_type__in=["vendor", "both"], is_active=True).order_by("contact_name")
        data = [
            {
                "contact_id": v.contact_id,
                "contact_name": v.contact_name,
                "email": v.email,
            }
            for v in vendors
        ]
        return Response(data)


class PurchaseOrderBillCreateView(generics.GenericAPIView):
    """
    Create a vendor bill for a given purchase order.
    """

    permission_classes = [AllowAny]  # per user request keep open

    def post(self, request, pk, *args, **kwargs):
        try:
            po = PurchaseOrder.objects.select_related("vendor").get(pk=pk)
        except PurchaseOrder.DoesNotExist:
            return Response({"detail": "Purchase order not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            # Defensive defaults so generated column constraints are satisfied
            subtotal = po.subtotal or 0
            tax_amount = po.tax_amount or 0
            total_amount = po.total_amount or (subtotal + tax_amount)

            # Generate the next bill number based on the latest bill_id to avoid collisions
            last = VendorBill.objects.order_by("-vendor_bill_id").first()
            next_num = (last.vendor_bill_id if last else 0) + 1
            bill_number = f"BILL-{next_num:04d}"

            today = timezone.now().date()

            with transaction.atomic():
                # Use raw insert to avoid touching generated column remaining_amount
                with connection.cursor() as cursor:
                    cursor.execute(
                        """
                        INSERT INTO vendor_bills
                        (bill_number, purchase_order_id, vendor_id, invoice_date, due_date,
                         bill_status, subtotal, tax_amount, total_amount, paid_amount, vendor_reference)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        """,
                        [
                            bill_number,
                            po.purchase_order_id,
                            po.vendor_id,
                            today,
                            today,
                            "draft",
                            subtotal,
                            tax_amount,
                            total_amount,
                            0,
                            po.po_number,
                        ],
                    )
                bill = VendorBill.objects.get(bill_number=bill_number)

                if po.po_status == "draft":
                    po.po_status = "confirmed"
                    po.save(update_fields=["po_status"])

            return Response(VendorBillSerializer(bill).data, status=status.HTTP_201_CREATED)
        except Exception as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)


class VendorBillPayView(generics.GenericAPIView):
    """
    Register a payment against a vendor bill. Auto-fills contact and amount due.
    """

    permission_classes = [AllowAny]  # per user request keep open

    def post(self, request, pk, *args, **kwargs):
        try:
            bill = VendorBill.objects.select_related("vendor").get(pk=pk)
        except VendorBill.DoesNotExist:
            return Response({"detail": "Vendor bill not found"}, status=status.HTTP_404_NOT_FOUND)

        amount_due = float(bill.remaining_amount or 0)
        if amount_due <= 0:
            return Response({"detail": "Bill already paid"}, status=status.HTTP_400_BAD_REQUEST)

        payment_number = f"PAY-{Payment.objects.count() + 1:05d}"
        today = timezone.now().date()

        payment = Payment.objects.create(
            payment_number=payment_number,
            payment_type="vendor_payment",
            contact=bill.vendor,
            payment_date=today,
            payment_method="bank_transfer",
            payment_amount=amount_due,
            payment_status="completed",
            notes=f"Auto payment for bill {bill.bill_number}",
        )

        PaymentAllocation.objects.create(
            payment=payment,
            vendor_bill=bill,
            allocated_amount=amount_due,
            allocation_date=today,
        )

        bill.paid_amount = (bill.paid_amount or 0) + amount_due
        bill.bill_status = "paid"
        bill.save(update_fields=["paid_amount", "bill_status"])

        return Response({"bill": VendorBillSerializer(bill).data, "payment_number": payment.payment_number})
