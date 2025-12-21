from rest_framework import serializers
from django.db import transaction, IntegrityError
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
    colors = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()

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

    def _as_qs(self, val):
        if val is None:
            return []
        try:
            if hasattr(val, "all"):
                return val.all()
        except Exception:
            return []
        if isinstance(val, (list, tuple)):
            return val
        return []

    def get_colors(self, obj):
        qs = self._as_qs(getattr(obj, "colors", None))
        return ProductColorSerializer(qs, many=True).data

    def get_images(self, obj):
        qs = self._as_qs(getattr(obj, "images", None))
        return ProductImageSerializer(qs, many=True).data


class ProductCreateSerializer(serializers.Serializer):
    product_name = serializers.CharField(max_length=255)
    product_code = serializers.CharField(max_length=50, required=False, allow_blank=True)
    product_category = serializers.CharField()
    product_type = serializers.CharField()
    material = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    description = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    sales_price = serializers.DecimalField(max_digits=15, decimal_places=2)
    purchase_price = serializers.DecimalField(max_digits=15, decimal_places=2)
    colors = serializers.ListField(child=serializers.CharField(), required=False)
    images = serializers.ListField(child=serializers.URLField(), required=False)
    is_published = serializers.BooleanField(required=False, default=True)
    is_active = serializers.BooleanField(required=False, default=True)

    def validate(self, attrs):
        # Ensure numeric fields are positive
        if attrs.get("sales_price", 0) < 0 or attrs.get("purchase_price", 0) < 0:
            raise serializers.ValidationError({"detail": "Prices must be non-negative."})
        # Normalize enums
        cat = (attrs.get("product_category") or "").lower()
        type_ = (attrs.get("product_type") or "").lower()
        cat_map = {"men": "men", "man": "men", "male": "men",
                   "women": "women", "woman": "women", "female": "women",
                   "child": "children", "children": "children", "kid": "children", "kids": "children",
                   "unisex": "unisex"}
        type_map = {
            "t-shirt": "t-shirt", "tshirt": "t-shirt", "tee": "t-shirt",
            "shirt": "shirt", "casual shirt": "shirt", "formal shirt": "shirt",
            "jeans": "jeans", "denim": "jeans",
            "pant": "pant", "pants": "pant", "trouser": "pant", "trousers": "pant", "bottom": "pant",
            "kurta": "kurta",
            "dress": "dress",
            "other": "other"
        }
        norm_cat = cat_map.get(cat, "men" if cat == "" else None)
        norm_type = None
        for key, val in type_map.items():
            if key in type_:
                norm_type = val
                break
        if norm_cat is None:
            raise serializers.ValidationError({"product_category": "Invalid category"})
        if norm_type is None:
            norm_type = "other"
        attrs["product_category"] = norm_cat
        attrs["product_type"] = norm_type
        return attrs

    def create(self, validated_data):
        colors = validated_data.pop("colors", [])
        images = validated_data.pop("images", [])
        # Defensive: if a RelatedManager or queryset was passed accidentally,
        # coerce to a plain list so iteration below works.
        def _coerce_iterable(val):
            if val is None:
                return []
            if hasattr(val, "all"):
                try:
                    return list(val.all())
                except TypeError:
                    return []
            if isinstance(val, (list, tuple)):
                return list(val)
            return [val]

        colors = _coerce_iterable(colors)
        images = _coerce_iterable(images)
        # generate product_code if missing
        if not validated_data.get("product_code"):
            validated_data["product_code"] = f"LUV-{Product.objects.count() + 1:05d}"

        try:
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
        except IntegrityError:
            raise serializers.ValidationError({"product_code": "Product code already exists."})
        except Exception as exc:
            # Surface any other DB/runtime issues as validation errors instead of 500
            raise serializers.ValidationError({"detail": str(exc)}) from exc
