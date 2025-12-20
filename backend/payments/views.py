from django.db import transaction
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from sales.models import CustomerInvoice
from .models import Payment, PaymentAllocation
from .serializers import PaymentSerializer
from system.services import get_next_document_number


class PaymentListView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(contact__users=self.request.user).order_by("-created_at")


class PaymentCreateView(generics.GenericAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        invoice_id = request.data.get("invoice_id")
        amount = request.data.get("amount")
        payment_method = request.data.get("payment_method", "upi")
        if not invoice_id or not amount:
            return Response(
                {"detail": "invoice_id and amount required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            invoice = CustomerInvoice.objects.select_for_update().get(pk=invoice_id)
        except CustomerInvoice.DoesNotExist:
            return Response({"detail": "Invoice not found"}, status=status.HTTP_404_NOT_FOUND)

        payment_number = get_next_document_number("payment")
        payment = Payment.objects.create(
            payment_number=payment_number,
            payment_type="customer_payment",
            contact=invoice.customer,
            payment_date=invoice.invoice_date,
            payment_method=payment_method,
            payment_amount=amount,
            payment_status="completed",
            created_by=request.user,
        )
        PaymentAllocation.objects.create(
            payment=payment,
            customer_invoice=invoice,
            allocated_amount=amount,
            allocation_date=invoice.invoice_date,
        )

        invoice.paid_amount = invoice.paid_amount + float(amount)
        invoice.remaining_amount = invoice.total_amount - invoice.paid_amount
        invoice.invoice_status = "paid" if invoice.remaining_amount <= 0 else "partially_paid"
        invoice.save(update_fields=["paid_amount", "remaining_amount", "invoice_status"])

        return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)
