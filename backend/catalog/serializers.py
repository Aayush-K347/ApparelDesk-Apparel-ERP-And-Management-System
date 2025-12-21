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
        """Safely convert RelatedManager/QuerySet to list"""
        if val is None:
            return []
        # Check if it has 'all()' method (RelatedManager/QuerySet)
        if hasattr(val, "all"):
            try:
                return list(val.all())
            except Exception:
                return []
        # Already a list or tuple
        if isinstance(val, (list, tuple)):
            return list(val)
        # Try to iterate it
        try:
            return list(val)
        except (TypeError, AttributeError):
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
    product_category = serializers.CharField(required=False, allow_blank=True, default="men")
    product_type = serializers.CharField(required=False, allow_blank=True, default="other")
    material = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    description = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    sales_price = serializers.DecimalField(max_digits=15, decimal_places=2)
    purchase_price = serializers.DecimalField(max_digits=15, decimal_places=2)
    colors = serializers.ListField(child=serializers.CharField(), required=False, allow_empty=True)
    images = serializers.ListField(child=serializers.URLField(), required=False, allow_empty=True)
    is_published = serializers.BooleanField(required=False, default=True)
    is_active = serializers.BooleanField(required=False, default=True)

    def validate(self, attrs):
        # Ensure numeric fields are positive
        if attrs.get("sales_price", 0) < 0 or attrs.get("purchase_price", 0) < 0:
            raise serializers.ValidationError({"detail": "Prices must be non-negative."})
        # Soft-defaults if missing
        if not attrs.get("product_category"):
            attrs["product_category"] = "men"
        if not attrs.get("product_type"):
            attrs["product_type"] = "other"
        # Normalize enums
        cat = (attrs.get("product_category") or "").lower()
        type_ = (attrs.get("product_type") or "").lower()
        
        cat_map = {
            "men": "men", "man": "men", "male": "men",
            "women": "women", "woman": "women", "female": "women",
            "child": "children", "children": "children", "kid": "children", "kids": "children",
            "unisex": "unisex"
        }
        
        type_map = {
            "t-shirt": "t-shirt", "tshirt": "t-shirt", "tee": "t-shirt",
            "shirt": "shirt", "casual shirt": "shirt", "formal shirt": "shirt", "casual shirts": "shirt",
            "jeans": "jeans", "denim": "jeans",
            "pant": "pant", "pants": "pant", "trouser": "pant", "trousers": "pant", "bottom": "pant",
            "kurta": "kurta",
            "dress": "dress",
            "hoodie": "other", "sweatshirt": "other", "topwear": "shirt",
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
        # Extract colors and images - ensure they are lists
        colors_data = validated_data.pop("colors", [])
        images_data = validated_data.pop("images", [])
        
        # Safely convert to list
        def safe_to_list(data):
            if data is None:
                return []
            if isinstance(data, list):
                return data
            if isinstance(data, tuple):
                return list(data)
            # Check if it's a RelatedManager or QuerySet
            if hasattr(data, 'all'):
                return list(data.all())
            # Try to convert to list
            try:
                return list(data)
            except (TypeError, AttributeError):
                return []
        
        colors_data = safe_to_list(colors_data)
        images_data = safe_to_list(images_data)
        
        # Generate GUARANTEED unique product_code
        if not validated_data.get("product_code") or validated_data.get("product_code").strip() == "":
            import uuid
            validated_data["product_code"] = f"LUV-{uuid.uuid4().hex[:8].upper()}"
        else:
            # If code provided, make it unique if it exists
            original_code = validated_data["product_code"]
            if Product.objects.filter(product_code=original_code).exists():
                import uuid
                validated_data["product_code"] = f"{original_code}-{uuid.uuid4().hex[:6].upper()}"

        try:
            with transaction.atomic():
                # Create product
                prod = Product.objects.create(
                    current_stock=50,
                    minimum_stock=5,
                    sales_tax_percentage=0,
                    purchase_tax_percentage=0,
                    **validated_data,
                )
                
                # Create colors
                seen_colors = set()
                for color in colors_data:
                    color_str = str(color).strip()
                    color_key = color_str.lower()
                    if not color_str or color_key in seen_colors:
                        continue
                    seen_colors.add(color_key)
                    ProductColor.objects.create(
                        product=prod,
                        color_name=color_str
                    )

                # Create images
                for idx, image_url in enumerate(images_data):
                    if not image_url:
                        continue
                    ProductImage.objects.create(
                        product=prod,
                        image_url=str(image_url),
                        image_alt_text=prod.product_name,
                        display_order=idx,
                        is_primary=(idx == 0),
                        is_active=True,
                    )
                
                return prod
                
        except IntegrityError as e:
            raise serializers.ValidationError({"product_code": "Product code already exists."})
        except Exception as e:
            raise serializers.ValidationError({"detail": str(e)})
