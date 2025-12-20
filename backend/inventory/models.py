from django.db import models
from catalog.models import Product
from accounts.models import TimeStampedModel


class StockMovement(TimeStampedModel):
    MOVEMENT_CHOICES = (
        ("purchase", "Purchase"),
        ("sale", "Sale"),
        ("adjustment", "Adjustment"),
        ("return", "Return"),
    )
    DIRECTION_CHOICES = (("in", "In"), ("out", "Out"))
    REF_CHOICES = (
        ("purchase_order", "Purchase Order"),
        ("sales_order", "Sales Order"),
        ("adjustment", "Adjustment"),
    )

    movement_id = models.BigAutoField(primary_key=True)
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name="stock_movements")
    movement_type = models.CharField(max_length=20, choices=MOVEMENT_CHOICES)
    movement_date = models.DateField()
    quantity = models.DecimalField(max_digits=15, decimal_places=3)
    movement_direction = models.CharField(max_length=3, choices=DIRECTION_CHOICES)
    reference_type = models.CharField(max_length=20, choices=REF_CHOICES)
    reference_id = models.BigIntegerField()
    stock_before = models.DecimalField(max_digits=15, decimal_places=3)
    stock_after = models.DecimalField(max_digits=15, decimal_places=3)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "stock_movements"
        indexes = [
            models.Index(fields=["product"], name="idx_movement_product"),
            models.Index(fields=["movement_date"], name="idx_movement_date"),
            models.Index(fields=["movement_type"], name="idx_movement_type"),
            models.Index(fields=["reference_type", "reference_id"], name="idx_movement_reference"),
        ]

    def __str__(self) -> str:
        return f"{self.product} {self.movement_type} {self.quantity}"
