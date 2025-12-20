from rest_framework import serializers
from django.db import transaction
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


class ProductCreateSerializer(serializers.Serializer):
    product_name = serializers.CharField(max_length=255)
    product_code = serializers.CharField(max_length=50, required=False, allow_blank=True)
    product_category = serializers.ChoiceField(choices=Product.CATEGORY_CHOICES)
    product_type = serializers.ChoiceField(choices=Product.TYPE_CHOICES)
    material = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    description = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    sales_price = serializers.DecimalField(max_digits=15, decimal_places=2)
    purchase_price = serializers.DecimalField(max_digits=15, decimal_places=2)
    colors = serializers.ListField(child=serializers.CharField(), required=False)
    images = serializers.ListField(child=serializers.URLField(), required=False)
    is_published = serializers.BooleanField(required=False, default=True)
    is_active = serializers.BooleanField(required=False, default=True)

    def create(self, validated_data):
        colors = validated_data.pop("colors", [])
        images = validated_data.pop("images", [])
        # generate product_code if missing
        if not validated_data.get("product_code"):
            validated_data["product_code"] = f"LUV-{Product.objects.count() + 1:05d}"

        with transaction.atomic():
            prod = Product.objects.create(
                current_stock=50,
                minimum_stock=5,
                sales_tax_percentage=0,
                purchase_tax_percentage=0,
                **validated_data,
            )
            seen = set()
            for c in colors:
                norm = (c or "").strip()
                key = norm.lower()
                if not norm or key in seen:
                    continue
                seen.add(key)
                ProductColor.objects.create(product=prod, color_name=norm)

            for i_order, img in enumerate(images or []):
                if not img:
                    continue
                ProductImage.objects.create(
                    product=prod,
                    image_url=img,
                    image_alt_text=prod.product_name,
                    display_order=i_order,
                    is_primary=(i_order == 0),
                    is_active=True,
                )
        return prod
