from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.db.models import Prefetch
from accounts.serializers import ContactSerializer
from accounts.models import Contact
from catalog.models import Product
from accounts.permissions import IsVendorUser
from purchases.models import VendorBill, PurchaseOrderLine
from .models import SalesOrder, CustomerInvoice, Cart, CartItem, SalesOrderLine
from .serializers import (
    SalesOrderSerializer,
    CustomerInvoiceSerializer,
    CheckoutSerializer,
    CartSerializer,
    SalesOrderDetailSerializer,
)
from .services import create_checkout
from django.shortcuts import get_object_or_404
from io import BytesIO
from django.http import HttpResponse

try:
    from reportlab.lib.pagesizes import A4
    from reportlab.pdfgen import canvas
    from reportlab.lib.units import mm
    from reportlab.lib import colors
except Exception:
    A4 = None
    canvas = None


class SalesOrderListView(generics.ListAPIView):
    serializer_class = SalesOrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            SalesOrder.objects.filter(customer__users=self.request.user)
            .prefetch_related(
                "lines",
                "lines__product",
                Prefetch("status_logs"),
            )
            .order_by("-created_at")
        )


class SalesOrderDetailView(generics.RetrieveAPIView):
    serializer_class = SalesOrderDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "pk"

    def get_queryset(self):
        return (
            SalesOrder.objects.filter(customer__users=self.request.user)
            .prefetch_related(
                "lines",
                "lines__product",
                Prefetch("invoices"),
                Prefetch("status_logs"),
            )
            .order_by("-created_at")
        )


class CustomerInvoiceListView(generics.ListAPIView):
    serializer_class = CustomerInvoiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CustomerInvoice.objects.filter(customer__users=self.request.user).order_by("-created_at")


class VendorInvoiceListView(generics.ListAPIView):
    serializer_class = CustomerInvoiceSerializer
    # Relaxed per user request to avoid 403; secure later as needed
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = (
            CustomerInvoice.objects.select_related("customer", "payment_term", "sales_order")
            .order_by("-created_at")
        )
        customer_id = self.request.query_params.get("customer_id")
        status = self.request.query_params.get("status")
        if customer_id:
            qs = qs.filter(customer_id=customer_id)
        if status:
            qs = qs.filter(invoice_status=status)
        return qs


class CheckoutView(generics.GenericAPIView):
    serializer_class = CheckoutSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        # If vendor/internal, allow explicit customer_id; otherwise bind to own contact
        if not (request.user and getattr(request.user, "contact_id", None)) or (
            request.user and getattr(request.user, "user_role", "") != "internal"
        ):
            if getattr(request.user, "contact_id", None):
                data["customer_id"] = request.user.contact_id
            elif request.user and request.user.is_authenticated:
                contact = Contact.objects.create(
                    contact_name=request.user.username or request.user.email or "Customer",
                    contact_type="customer",
                    email=request.user.email or f"user-{request.user.user_id}@example.com",
                    mobile="",
                )
                request.user.contact = contact
                request.user.save(update_fields=["contact"])
                data["customer_id"] = contact.contact_id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        try:
            order, invoice = create_checkout(serializer.validated_data, user=request.user)
        except Exception as exc:  # pragma: no cover - defensive
            # Surface the error to the client instead of a 500
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(
            {
                "order": SalesOrderSerializer(order).data,
                "invoice": CustomerInvoiceSerializer(invoice).data,
            },
            status=status.HTTP_201_CREATED,
        )


class PublicContactLookupView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        return Response(ContactSerializer(request.user.contact).data)


class CustomerListForOrdersView(generics.ListAPIView):
    """
    For vendor/internal users to select any portal customer for sale orders.
    """

    serializer_class = ContactSerializer
    # Relaxed per user request to avoid 403 during testing
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = Contact.objects.filter(contact_type__in=["customer", "both"], is_active=True).order_by("contact_name")
        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(contact_name__icontains=search)
        return qs


class SalesOrderStatusUpdateView(generics.GenericAPIView):
    serializer_class = SalesOrderSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk, *args, **kwargs):
        order = get_object_or_404(
            SalesOrder.objects.filter(customer__users=request.user), pk=pk
        )
        new_status = request.data.get("order_status")
        allowed = {"confirmed", "invoiced", "completed", "cancelled"}
        if new_status not in allowed:
            return Response({"detail": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
        previous_status = order.order_status
        order.order_status = new_status
        order.save(update_fields=["order_status"])
        # Log the change
        from .models import SalesOrderStatusLog

        SalesOrderStatusLog.objects.create(
            sales_order=order,
            previous_status=previous_status,
            new_status=new_status,
            changed_by=request.user,
            note="Updated by customer",
        )
        return Response(SalesOrderSerializer(order).data)


class CartView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CartSerializer

    def get_cart(self, user):
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart

    def get(self, request, *args, **kwargs):
        cart = self.get_cart(request.user)
        return Response(CartSerializer(cart).data)

    def post(self, request, *args, **kwargs):
        cart = self.get_cart(request.user)
        items = request.data.get("items")
        if items is None or not isinstance(items, list):
            return Response({"detail": "items must be a list"}, status=status.HTTP_400_BAD_REQUEST)
        cart.items.all().delete()
        created_items = []
        for item in items:
            try:
                product_id = int(item.get("product_id"))
                quantity = item.get("quantity")
            except Exception:
                return Response({"detail": "Invalid product or quantity"}, status=status.HTTP_400_BAD_REQUEST)
            if not product_id or quantity is None:
                return Response({"detail": "product_id and quantity are required"}, status=status.HTTP_400_BAD_REQUEST)
            product = Product.objects.filter(pk=product_id).first()
            if not product:
                return Response({"detail": f"Product {product_id} not found"}, status=status.HTTP_400_BAD_REQUEST)
            created_items.append(
                CartItem(
                    cart=cart,
                    product=product,
                    quantity=quantity,
                    selected_size=item.get("selected_size") or "",
                    selected_color=item.get("selected_color") or "",
                )
            )
        CartItem.objects.bulk_create(created_items)
        cart.refresh_from_db()
        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)


class InvoiceReportPdfView(generics.GenericAPIView):
    """
    Generate a combined PDF with Customer Invoices and Vendor Bills.
    """

    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        if not (canvas and A4):
            return Response({"detail": "PDF generator not available. Install reportlab."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        # Filters (optional)
        status_filter = request.query_params.get("status")
        vendor_id = request.query_params.get("vendor_id")
        customer_id = request.query_params.get("customer_id")
        group_by = request.query_params.get("group_by") or "document"

        invoices = CustomerInvoice.objects.select_related("customer").order_by("-created_at")
        bills = VendorBill.objects.select_related("vendor").order_by("-created_at")

        if status_filter:
            invoices = invoices.filter(invoice_status=status_filter)
            bills = bills.filter(bill_status=status_filter)
        if vendor_id:
            bills = bills.filter(vendor_id=vendor_id)
        if customer_id:
            invoices = invoices.filter(customer_id=customer_id)

        buffer = BytesIO()
        pdf = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4

        def header(title: str):
            pdf.setFont("Helvetica-Bold", 18)
            pdf.drawCentredString(width / 2.0, height - 30 * mm, title)
            pdf.setFont("Helvetica", 10)
            pdf.setFillColor(colors.grey)
            pdf.drawCentredString(width / 2.0, height - 36 * mm, "LUV'ARTE REPORT")
            pdf.setFillColor(colors.black)

        def table(start_y, rows, headers, title):
            y = start_y
            pdf.setFont("Helvetica-Bold", 12)
            pdf.drawString(20 * mm, y, title)
            y -= 6 * mm
            pdf.setFont("Helvetica-Bold", 9)
            x_positions = [20, 80, 130, 160]
            for x, h in zip(x_positions, headers):
                pdf.drawString(x * mm / 10, y, h)
            y -= 5 * mm
            pdf.setFont("Helvetica", 9)
            for row in rows:
                if y < 20 * mm:
                    pdf.showPage()
                    header("Invoices & Bills")
                    y = height - 40 * mm
                    pdf.setFont("Helvetica-Bold", 9)
                    for x, h in zip(x_positions, headers):
                        pdf.drawString(x * mm / 10, y, h)
                    y -= 5 * mm
                    pdf.setFont("Helvetica", 9)
                for x, val in zip(x_positions, row):
                    pdf.drawString(x * mm / 10, y, str(val))
                y -= 5 * mm
            return y

        header("Invoices & Bills")
        y_pos = height - 45 * mm

        if group_by == "contact":
            # Aggregate totals by partner (customer/vendor)
            contact_rows = []
            from collections import defaultdict

            data = defaultdict(lambda: {"invoices": 0, "bills": 0})
            for inv in invoices:
                name = inv.customer.contact_name if inv.customer_id else "Customer"
                data[name]["invoices"] += float(inv.total_amount or 0)
            for bill in bills:
                name = bill.vendor.contact_name if bill.vendor_id else "Vendor"
                data[name]["bills"] += float(bill.total_amount or 0)
            for name, vals in data.items():
                contact_rows.append([name, f"₹{vals['invoices']:.2f}", f"₹{vals['bills']:.2f}"])
            table(y_pos, contact_rows, ["Partner", "Invoice Total", "Bill Total"], "Grouped by Partner")
        elif group_by == "product":
            # Aggregate totals by product from order lines tied to invoices/bills
            from collections import defaultdict

            product_totals = defaultdict(lambda: {"sales": 0, "purchase": 0})
            so_ids = list(invoices.values_list("sales_order_id", flat=True))
            po_ids = list(bills.values_list("purchase_order_id", flat=True))
            for line in SalesOrderLine.objects.filter(sales_order_id__in=so_ids).select_related("product"):
                product_totals[line.product.product_name]["sales"] += float(line.line_total or 0)
            for line in PurchaseOrderLine.objects.filter(purchase_order_id__in=po_ids).select_related("product"):
                product_totals[line.product.product_name]["purchase"] += float(line.line_total or 0)
            rows = [
                [
                    name,
                    f"₹{vals['sales']:.2f}",
                    f"₹{vals['purchase']:.2f}",
                ]
                for name, vals in product_totals.items()
            ]
            table(y_pos, rows, ["Product", "Sales Total", "Purchase Total"], "Grouped by Product")
        else:
            # Default: list documents
            invoice_rows = [
                [
                    inv.invoice_number or f"INV-{inv.customer_invoice_id}",
                    inv.customer.contact_name if inv.customer_id else "Customer",
                    f"₹{inv.total_amount}",
                    inv.invoice_status,
                ]
                for inv in invoices
            ]
            y_pos = table(y_pos, invoice_rows, ["Number", "Partner", "Total", "Status"], "Customer Invoices")

            bill_rows = [
                [
                    bill.bill_number or f"BILL-{bill.vendor_bill_id}",
                    bill.vendor.contact_name if bill.vendor_id else "Vendor",
                    f"₹{bill.total_amount}",
                    bill.bill_status,
                ]
                for bill in bills
            ]
            table(y_pos - 5 * mm, bill_rows, ["Number", "Partner", "Total", "Status"], "Vendor Bills")

        pdf.showPage()
        pdf.save()

        buffer.seek(0)
        response = HttpResponse(buffer, content_type="application/pdf")
        response["Content-Disposition"] = 'attachment; filename="luvarte_invoices_bills.pdf"'
        return response


class InvoiceReportSummaryView(generics.GenericAPIView):
    """
    JSON summary for invoices/bills grouped by document/contact/product.
    """

    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        group_by = request.query_params.get("group_by") or "document"
        status_filter = request.query_params.get("status")
        vendor_id = request.query_params.get("vendor_id")
        customer_id = request.query_params.get("customer_id")

        invoices = CustomerInvoice.objects.select_related("customer").order_by("-created_at")
        bills = VendorBill.objects.select_related("vendor").order_by("-created_at")
        if status_filter:
            invoices = invoices.filter(invoice_status=status_filter)
            bills = bills.filter(bill_status=status_filter)
        if vendor_id:
            bills = bills.filter(vendor_id=vendor_id)
        if customer_id:
            invoices = invoices.filter(customer_id=customer_id)

        if group_by == "contact":
            from collections import defaultdict

            data = defaultdict(lambda: {"invoice_total": 0, "bill_total": 0})
            for inv in invoices:
                name = inv.customer.contact_name if inv.customer_id else "Customer"
                data[name]["invoice_total"] += float(inv.total_amount or 0)
            for bill in bills:
                name = bill.vendor.contact_name if bill.vendor_id else "Vendor"
                data[name]["bill_total"] += float(bill.total_amount or 0)
            rows = [
                {"partner": name, "invoice_total": vals["invoice_total"], "bill_total": vals["bill_total"]}
                for name, vals in data.items()
            ]
            return Response({"group_by": "contact", "rows": rows})

        if group_by == "product":
            from collections import defaultdict

            product_totals = defaultdict(lambda: {"sales": 0, "purchase": 0})
            so_ids = list(invoices.values_list("sales_order_id", flat=True))
            po_ids = list(bills.values_list("purchase_order_id", flat=True))
            for line in SalesOrderLine.objects.filter(sales_order_id__in=so_ids).select_related("product"):
                product_totals[line.product.product_name]["sales"] += float(line.line_total or 0)
            for line in PurchaseOrderLine.objects.filter(purchase_order_id__in=po_ids).select_related("product"):
                product_totals[line.product.product_name]["purchase"] += float(line.line_total or 0)
            rows = [
                {"product": name, "sales_total": vals["sales"], "purchase_total": vals["purchase"]}
                for name, vals in product_totals.items()
            ]
            return Response({"group_by": "product", "rows": rows})

        # default: document list
        invoice_rows = [
            {
                "number": inv.invoice_number or f"INV-{inv.customer_invoice_id}",
                "partner": inv.customer.contact_name if inv.customer_id else "Customer",
                "total": float(inv.total_amount or 0),
                "status": inv.invoice_status,
                "type": "invoice",
            }
            for inv in invoices
        ]
        bill_rows = [
            {
                "number": bill.bill_number or f"BILL-{bill.vendor_bill_id}",
                "partner": bill.vendor.contact_name if bill.vendor_id else "Vendor",
                "total": float(bill.total_amount or 0),
                "status": bill.bill_status,
                "type": "bill",
            }
            for bill in bills
        ]
        return Response({"group_by": "document", "rows": invoice_rows + bill_rows})
