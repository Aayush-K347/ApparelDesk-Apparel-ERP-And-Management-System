from django.db import models
from accounts.models import TimeStampedModel


class Product(TimeStampedModel):
    CATEGORY_CHOICES = (
        ("men", "Men"),
        ("women", "Women"),
        ("children", "Children"),
        ("unisex", "Unisex"),
    )
    TYPE_CHOICES = (
        ("shirt", "Shirt"),
        ("pant", "Pant"),
        ("kurta", "Kurta"),
        ("t-shirt", "T-shirt"),
        ("jeans", "Jeans"),
        ("dress", "Dress"),
        ("other", "Other"),
    )

    product_id = models.BigAutoField(primary_key=True)
    product_name = models.CharField(max_length=255)
    product_code = models.CharField(max_length=50, unique=True)
    product_category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    product_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    material = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    current_stock = models.DecimalField(max_digits=15, decimal_places=3, default=0)
    minimum_stock = models.DecimalField(max_digits=15, decimal_places=3, default=0)
    sales_price = models.DecimalField(max_digits=15, decimal_places=2)
    sales_tax_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    purchase_price = models.DecimalField(max_digits=15, decimal_places=2)
    purchase_tax_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    is_published = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_by = models.BigIntegerField(null=True, blank=True, db_column="created_by")
    updated_by = models.BigIntegerField(null=True, blank=True, db_column="updated_by")

    class Meta:
        db_table = "products"
        indexes = [
            models.Index(fields=["product_code"], name="idx_product_code"),
            models.Index(fields=["product_category"], name="idx_product_category"),
            models.Index(fields=["product_type"], name="idx_product_type"),
            models.Index(fields=["is_published"], name="idx_product_published"),
            models.Index(fields=["is_active"], name="idx_product_active"),
            models.Index(fields=["current_stock"], name="idx_product_stock"),
        ]

    def __str__(self) -> str:
        return f"{self.product_name} ({self.product_code})"


class ProductColor(models.Model):
    color_id = models.BigAutoField(primary_key=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="colors")
    color_name = models.CharField(max_length=50)
    color_code = models.CharField(max_length=7, blank=True, null=True)
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "product_colors"
        unique_together = (("product", "color_name"),)
        indexes = [
            models.Index(fields=["product"], name="idx_color_product"),
        ]

    def __str__(self) -> str:
        return f"{self.product} - {self.color_name}"


class ProductImage(models.Model):
    image_id = models.BigAutoField(primary_key=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image_url = models.URLField(max_length=500)
    image_alt_text = models.CharField(max_length=255, blank=True, null=True)
    display_order = models.IntegerField(default=0)
    is_primary = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "product_images"
        indexes = [
            models.Index(fields=["product"], name="idx_image_product"),
            models.Index(fields=["is_primary"], name="idx_image_primary"),
        ]

    def __str__(self) -> str:
        return f"{self.product} image {self.image_id}"
