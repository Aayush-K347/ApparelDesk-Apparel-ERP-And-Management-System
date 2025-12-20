from django.db import models
from accounts.models import Contact, TimeStampedModel
from catalog.models import Product


class PurchaseOrder(TimeStampedModel):
    STATUS_CHOICES = (
        ("draft", "Draft"),
        ("confirmed", "Confirmed"),
        ("received", "Received"),
        ("cancelled", "Cancelled"),
    )

    purchase_order_id = models.BigAutoField(primary_key=True)
    po_number = models.CharField(max_length=50, unique=True)
    vendor = models.ForeignKey(Contact, on_delete=models.PROTECT, related_name="purchase_orders")
    order_date = models.DateField()
    expected_delivery_date = models.DateField(null=True, blank=True)
    po_status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="draft")
    subtotal = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    notes = models.TextField(blank=True, null=True)
    created_by = models.BigIntegerField(null=True, blank=True, db_column="created_by")
    confirmed_by = models.BigIntegerField(null=True, blank=True, db_column="confirmed_by")
    confirmed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "purchase_orders"
        indexes = [
            models.Index(fields=["po_number"], name="idx_po_number"),
            models.Index(fields=["vendor"], name="idx_po_vendor"),
            models.Index(fields=["po_status"], name="idx_po_status"),
            models.Index(fields=["order_date"], name="idx_po_order_date"),
        ]

    def __str__(self) -> str:
        return self.po_number


class PurchaseOrderLine(models.Model):
    po_line_id = models.BigAutoField(primary_key=True)
    purchase_order = models.ForeignKey(
        PurchaseOrder, on_delete=models.CASCADE, related_name="lines"
    )
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name="purchase_lines")
    line_number = models.IntegerField()
    quantity = models.DecimalField(max_digits=15, decimal_places=3)
    unit_price = models.DecimalField(max_digits=15, decimal_places=2)
    tax_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    line_subtotal = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    line_tax_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    line_total = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    received_quantity = models.DecimalField(max_digits=15, decimal_places=3, default=0)

    class Meta:
        db_table = "purchase_order_lines"
        unique_together = (("purchase_order", "line_number"),)
        indexes = [
            models.Index(fields=["purchase_order"], name="idx_po_line_po"),
            models.Index(fields=["product"], name="idx_po_line_product"),
        ]

    def __str__(self) -> str:
        return f"{self.purchase_order} line {self.line_number}"


class VendorBill(TimeStampedModel):
    STATUS_CHOICES = (
        ("draft", "Draft"),
        ("confirmed", "Confirmed"),
        ("partially_paid", "Partially Paid"),
        ("paid", "Paid"),
        ("cancelled", "Cancelled"),
    )

    vendor_bill_id = models.BigAutoField(primary_key=True)
    bill_number = models.CharField(max_length=50, unique=True)
    purchase_order = models.ForeignKey(
        PurchaseOrder, on_delete=models.PROTECT, related_name="vendor_bills"
    )
    vendor = models.ForeignKey(Contact, on_delete=models.PROTECT, related_name="vendor_bills")
    invoice_date = models.DateField()
    due_date = models.DateField()
    bill_status = models.CharField(max_length=15, choices=STATUS_CHOICES, default="draft")
    subtotal = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    paid_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    # Computed in DB (total_amount - paid_amount). Keep DB default by excluding from INSERT/UPDATE.
    remaining_amount = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        null=True,
        blank=True,
        editable=False,
        db_default=None,
    )
    vendor_reference = models.CharField(max_length=100, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_by = models.BigIntegerField(null=True, blank=True, db_column="created_by")

    class Meta:
        db_table = "vendor_bills"
        indexes = [
            models.Index(fields=["bill_number"], name="idx_bill_number"),
            models.Index(fields=["vendor"], name="idx_bill_vendor"),
            models.Index(fields=["purchase_order"], name="idx_bill_po"),
            models.Index(fields=["bill_status"], name="idx_bill_status"),
            models.Index(fields=["invoice_date", "due_date"], name="idx_bill_dates"),
        ]

    def __str__(self) -> str:
        return self.bill_number
