from django.conf import settings
from django.db import models
from accounts.models import Contact, TimeStampedModel
from pricing.models import PaymentTerm, CouponCode
from catalog.models import Product
from accounts.models import Address
from django.contrib.auth import get_user_model

User = get_user_model()


class SalesOrder(TimeStampedModel):
    SOURCE_CHOICES = (("backend", "Backend"), ("website", "Website"))
    STATUS_CHOICES = (
        ("draft", "Draft"),
        ("confirmed", "Confirmed"),
        ("invoiced", "Invoiced"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    )

    sales_order_id = models.BigAutoField(primary_key=True)
    so_number = models.CharField(max_length=50, unique=True)
    customer = models.ForeignKey(Contact, on_delete=models.PROTECT, related_name="sales_orders")
    payment_term = models.ForeignKey(
        PaymentTerm, on_delete=models.PROTECT, related_name="sales_orders"
    )
    order_date = models.DateField()
    order_source = models.CharField(max_length=10, choices=SOURCE_CHOICES, default="backend")
    order_status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="draft")
    subtotal = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    coupon = models.ForeignKey(
        CouponCode, on_delete=models.SET_NULL, null=True, blank=True, related_name="sales_orders"
    )
    applied_discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    notes = models.TextField(blank=True, null=True)
    shipping_address_line1 = models.CharField(max_length=255, blank=True, null=True)
    shipping_address_line2 = models.CharField(max_length=255, blank=True, null=True)
    shipping_city = models.CharField(max_length=100, blank=True, null=True)
    shipping_state = models.CharField(max_length=100, blank=True, null=True)
    shipping_pincode = models.CharField(max_length=10, blank=True, null=True)
    shipping_country = models.CharField(max_length=100, default="India")
    shipping_address = models.ForeignKey(
        Address,
        on_delete=models.PROTECT,
        related_name="sales_orders",
        null=True,
        blank=True,
    )
    created_by = models.BigIntegerField(null=True, blank=True, db_column="created_by")
    confirmed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = "sales_orders"
        indexes = [
            models.Index(fields=["so_number"], name="idx_so_number"),
            models.Index(fields=["customer"], name="idx_so_customer"),
            models.Index(fields=["order_status"], name="idx_so_status"),
            models.Index(fields=["order_source"], name="idx_so_source"),
            models.Index(fields=["order_date"], name="idx_so_order_date"),
            models.Index(fields=["shipping_address"], name="idx_so_ship_address"),
        ]

    def __str__(self) -> str:
        return self.so_number


class SalesOrderLine(models.Model):
    so_line_id = models.BigAutoField(primary_key=True)
    sales_order = models.ForeignKey(
        SalesOrder, on_delete=models.CASCADE, related_name="lines"
    )
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name="sales_lines")
    line_number = models.IntegerField()
    quantity = models.DecimalField(max_digits=15, decimal_places=3)
    unit_price = models.DecimalField(max_digits=15, decimal_places=2)
    tax_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    line_subtotal = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    line_tax_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    line_total = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    invoiced_quantity = models.DecimalField(max_digits=15, decimal_places=3, default=0)

    class Meta:
        db_table = "sales_order_lines"
        unique_together = (("sales_order", "line_number"),)
        indexes = [
            models.Index(fields=["sales_order"], name="idx_sales_order"),
            models.Index(fields=["product"], name="idx_sales_product"),
        ]

    def __str__(self) -> str:
        return f"{self.sales_order} line {self.line_number}"


class CustomerInvoice(TimeStampedModel):
    STATUS_CHOICES = (
        ("draft", "Draft"),
        ("confirmed", "Confirmed"),
        ("partially_paid", "Partially Paid"),
        ("paid", "Paid"),
        ("cancelled", "Cancelled"),
    )

    customer_invoice_id = models.BigAutoField(primary_key=True)
    invoice_number = models.CharField(max_length=50, unique=True)
    sales_order = models.ForeignKey(
        SalesOrder, on_delete=models.PROTECT, related_name="invoices"
    )
    customer = models.ForeignKey(Contact, on_delete=models.PROTECT, related_name="invoices")
    payment_term = models.ForeignKey(
        PaymentTerm, on_delete=models.PROTECT, related_name="invoices"
    )
    invoice_date = models.DateField()
    due_date = models.DateField()
    invoice_status = models.CharField(max_length=15, choices=STATUS_CHOICES, default="draft")
    subtotal = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    paid_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    remaining_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    early_payment_discount_applicable = models.BooleanField(default=False)
    early_payment_discount_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    early_payment_deadline = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True, null=True)
    created_by = models.BigIntegerField(null=True, blank=True, db_column="created_by")

    class Meta:
        db_table = "customer_invoices"
        indexes = [
            models.Index(fields=["invoice_number"], name="idx_invoice_number"),
            models.Index(fields=["customer"], name="idx_invoice_customer"),
            models.Index(fields=["sales_order"], name="idx_invoice_sales_order"),
            models.Index(fields=["invoice_status"], name="idx_invoice_status"),
            models.Index(fields=["invoice_date", "due_date"], name="idx_invoice_dates"),
        ]

    def __str__(self) -> str:
        return self.invoice_number


class SalesOrderStatusLog(TimeStampedModel):
    log_id = models.BigAutoField(primary_key=True)
    sales_order = models.ForeignKey(
        SalesOrder, on_delete=models.CASCADE, related_name="status_logs"
    )
    previous_status = models.CharField(max_length=15)
    new_status = models.CharField(max_length=15)
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="order_status_changes",
    )
    note = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = "sales_order_status_logs"
        indexes = [
            models.Index(fields=["sales_order"], name="idx_so_statuslog_order"),
            models.Index(fields=["new_status"], name="idx_so_statuslog_status"),
        ]

    def __str__(self) -> str:
        return f"{self.sales_order} {self.previous_status} -> {self.new_status}"


class Cart(TimeStampedModel):
    cart_id = models.BigAutoField(primary_key=True)
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="cart",
        db_index=True,
        db_constraint=False,
    )

    class Meta:
        db_table = "carts"
        indexes = [models.Index(fields=["user"], name="idx_cart_user")]

    def __str__(self) -> str:
        return f"Cart for {self.user}"


class CartItem(TimeStampedModel):
    cart_item_id = models.BigAutoField(primary_key=True)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name="cart_items")
    quantity = models.DecimalField(max_digits=15, decimal_places=3)
    selected_size = models.CharField(max_length=20, blank=True, null=True)
    selected_color = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        db_table = "cart_items"
        unique_together = (("cart", "product", "selected_size", "selected_color"),)
        indexes = [
            models.Index(fields=["cart"], name="idx_cartitem_cart"),
            models.Index(fields=["product"], name="idx_cartitem_product"),
        ]

    def __str__(self) -> str:
        return f"{self.product} x {self.quantity}"
