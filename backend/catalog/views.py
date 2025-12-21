from rest_framework import generics, filters, serializers
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework import status
from accounts.permissions import IsVendorUser
from .models import Product, ProductColor, ProductImage
from .serializers import ProductSerializer, ProductCreateSerializer
from django.db import transaction
from django.db import IntegrityError
import uuid


class ProductPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = "page_size"
    max_page_size = 500


class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    queryset = Product.objects.filter(is_active=True, is_published=True).prefetch_related(
        "colors", "images"
    ).order_by("product_id")
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["product_name", "product_code", "description"]
    ordering_fields = ["sales_price", "product_name", "popularity"]
    pagination_class = ProductPagination

    def get_queryset(self):
        qs = super().get_queryset()
        gender = self.request.query_params.get("gender")
        group = self.request.query_params.get("group")
        category = self.request.query_params.get("category")
        if gender:
            qs = qs.filter(product_category=gender.lower())
        if group:
            qs = qs.filter(product_type__icontains=group)
        if category:
            qs = qs.filter(product_type__icontains=category)
        return qs


class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    lookup_field = "product_id"
    queryset = Product.objects.filter(is_active=True).prefetch_related("colors", "images").order_by("product_id")


class VendorProductListCreateView(generics.ListCreateAPIView):
    # Per request: no auth required for vendor product add/list
    permission_classes = [AllowAny]
    queryset = Product.objects.filter(is_active=True).prefetch_related("colors", "images").order_by("product_id")
    pagination_class = ProductPagination

    def get_serializer_class(self):
        if self.request.method == "POST":
            return ProductCreateSerializer
        return ProductSerializer

    def perform_create(self, serializer):
        serializer.save()

    def create(self, request, *args, **kwargs):
        """
        Direct insert path so vendor products always land in products table
        without strict serializer validation. Normalizes enums and fills defaults.
        """
        data = request.data or {}
        try:
            with transaction.atomic():
                name = (data.get("product_name") or "").strip()
                if not name:
                    return Response({"detail": "product_name is required"}, status=status.HTTP_400_BAD_REQUEST)

                # Normalize enums with safe defaults
                cat_raw = (data.get("product_category") or "men").lower()
                type_raw = (data.get("product_type") or "other").lower()
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
                norm_cat = cat_map.get(cat_raw, "men")
                norm_type = None
                for key, val in type_map.items():
                    if key in type_raw:
                        norm_type = val
                        break
                if norm_type is None:
                    norm_type = "other"

                # Prices
                try:
                    sales_price = float(data.get("sales_price", 0))
                    purchase_price = float(data.get("purchase_price", 0))
                except Exception:
                    return Response({"detail": "sales_price and purchase_price must be numbers"}, status=status.HTTP_400_BAD_REQUEST)
                if sales_price < 0 or purchase_price < 0:
                    return Response({"detail": "Prices must be non-negative"}, status=status.HTTP_400_BAD_REQUEST)

                # Product code unique
                code = (data.get("product_code") or "").strip()
                if not code:
                    code = f"LUV-{uuid.uuid4().hex[:8].upper()}"
                if Product.objects.filter(product_code=code).exists():
                    code = f"{code}-{uuid.uuid4().hex[:6].upper()}"

                prod = Product.objects.create(
                    product_name=name,
                    product_code=code,
                    product_category=norm_cat,
                    product_type=norm_type,
                    material=data.get("material") or "",
                    description=data.get("description") or "",
                    current_stock=0,
                    minimum_stock=0,
                    sales_price=sales_price,
                    purchase_price=purchase_price,
                    sales_tax_percentage=float(data.get("sales_tax_percentage", 0) or 0),
                    purchase_tax_percentage=float(data.get("purchase_tax_percentage", 0) or 0),
                    is_published=bool(data.get("is_published", True)),
                    is_active=True,
                )

                colors = data.get("colors") or []
                if hasattr(colors, "all"):
                    colors = list(colors.all())
                if not isinstance(colors, (list, tuple)):
                    colors = [colors]
                seen = set()
                for color in colors:
                    cstr = str(color).strip()
                    if not cstr:
                        continue
                    key = cstr.lower()
                    if key in seen:
                        continue
                    seen.add(key)
                    ProductColor.objects.create(product=prod, color_name=cstr, display_order=len(seen))

                images = data.get("images") or []
                if hasattr(images, "all"):
                    images = list(images.all())
                if not isinstance(images, (list, tuple)):
                    images = [images]
                for idx, img in enumerate(images):
                    url = str(img).strip()
                    if not url:
                        continue
                    ProductImage.objects.create(
                        product=prod,
                        image_url=url,
                        image_alt_text=name,
                        display_order=idx,
                        is_primary=(idx == 0),
                        is_active=True,
                    )

                prod = Product.objects.filter(pk=prod.pk).prefetch_related("colors", "images").first()
                return Response(ProductSerializer(prod).data, status=status.HTTP_201_CREATED)
        except IntegrityError as exc:
            return Response({"detail": "Product code already exists"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
