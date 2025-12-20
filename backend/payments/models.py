from django.db import models
from accounts.models import Contact, TimeStampedModel
from sales.models import CustomerInvoice
from purchases.models import VendorBill


class Payment(TimeStampedModel):
    TYPE_CHOICES = (("customer_payment", "Customer Payment"), ("vendor_payment", "Vendor Payment"))
    METHOD_CHOICES = (
        ("cash", "Cash"),
        ("credit_card", "Credit Card"),
        ("debit_card", "Debit Card"),
        ("bank_transfer", "Bank Transfer"),
        ("upi", "UPI"),
        ("wallet", "Wallet"),
        ("other", "Other"),
    )
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("failed", "Failed"),
        ("refunded", "Refunded"),
    )

    payment_id = models.BigAutoField(primary_key=True)
    payment_number = models.CharField(max_length=50, unique=True)
    payment_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    contact = models.ForeignKey(Contact, on_delete=models.PROTECT, related_name="payments")
    payment_date = models.DateField()
    payment_method = models.CharField(max_length=20, choices=METHOD_CHOICES)
    payment_amount = models.DecimalField(max_digits=15, decimal_places=2)
    payment_status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="completed")
    reference_number = models.CharField(max_length=100, blank=True, null=True)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_by = models.BigIntegerField(null=True, blank=True, db_column="created_by")

    class Meta:
        db_table = "payments"
        indexes = [
            models.Index(fields=["payment_number"], name="idx_payment_number"),
            models.Index(fields=["contact"], name="idx_payment_contact"),
            models.Index(fields=["payment_type"], name="idx_payment_type"),
            models.Index(fields=["payment_date"], name="idx_payment_date"),
            models.Index(fields=["payment_status"], name="idx_payment_status"),
        ]

    def __str__(self) -> str:
        return self.payment_number


class PaymentAllocation(TimeStampedModel):
    allocation_id = models.BigAutoField(primary_key=True)
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name="allocations")
    customer_invoice = models.ForeignKey(
        CustomerInvoice, on_delete=models.CASCADE, null=True, blank=True, related_name="allocations"
    )
    vendor_bill = models.ForeignKey(
        VendorBill, on_delete=models.CASCADE, null=True, blank=True, related_name="allocations"
    )
    allocated_amount = models.DecimalField(max_digits=15, decimal_places=2)
    allocation_date = models.DateField()
    early_payment_discount_applied = models.BooleanField(default=False)
    discount_amount_applied = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    class Meta:
        db_table = "payment_allocations"
        indexes = [
            models.Index(fields=["payment"], name="idx_payalloc_payment"),
            models.Index(fields=["customer_invoice"], name="idx_payalloc_invoice"),
            models.Index(fields=["vendor_bill"], name="idx_payalloc_bill"),
        ]

    def __str__(self) -> str:
        return f"Allocation {self.allocation_id}"
