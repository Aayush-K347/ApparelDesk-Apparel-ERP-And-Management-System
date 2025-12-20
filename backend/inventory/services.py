from django.db import transaction
from catalog.models import Product
from purchases.models import PurchaseOrderLine
from .models import StockMovement


@transaction.atomic
def update_stock_from_purchase(purchase_order_id: int, movement_date=None):
    movement_date = movement_date or None
    lines = PurchaseOrderLine.objects.select_related("product").filter(
        purchase_order_id=purchase_order_id
    )
    for line in lines:
        product = Product.objects.select_for_update().get(pk=line.product_id)
        stock_before = product.current_stock
        stock_after = stock_before + line.quantity
        product.current_stock = stock_after
        product.save(update_fields=["current_stock"])
        StockMovement.objects.create(
            product=product,
            movement_type="purchase",
            movement_date=movement_date or product.updated_at.date(),
            quantity=line.quantity,
            movement_direction="in",
            reference_type="purchase_order",
            reference_id=purchase_order_id,
            stock_before=stock_before,
            stock_after=stock_after,
        )
