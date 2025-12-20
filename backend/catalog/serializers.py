from rest_framework import serializers
from .models import Product, ProductColor, ProductImage


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["image_id", "image_url", "image_alt_text", "display_order", "is_primary"]


class ProductColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductColor
        fields = ["color_id", "color_name", "color_code", "display_order", "is_active"]


class ProductSerializer(serializers.ModelSerializer):
    colors = ProductColorSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "product_id",
            "product_name",
            "product_code",
            "product_category",
            "product_type",
            "material",
            "description",
            "current_stock",
            "minimum_stock",
            "sales_price",
            "sales_tax_percentage",
            "purchase_price",
            "purchase_tax_percentage",
            "is_published",
            "is_active",
            "colors",
            "images",
        ]
