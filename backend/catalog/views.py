from rest_framework import generics, filters, serializers
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework import status
from accounts.permissions import IsVendorUser
from .models import Product
from .serializers import ProductSerializer, ProductCreateSerializer


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
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data if hasattr(serializer, "data") else {})
            instance = Product.objects.filter(pk=getattr(serializer.instance, "pk", None)).prefetch_related("colors", "images").first()
            if instance is None:
                return Response({"detail": "Product not found after creation"}, status=status.HTTP_400_BAD_REQUEST)
            return Response(ProductSerializer(instance).data, status=status.HTTP_201_CREATED, headers=headers)
        except serializers.ValidationError:
            raise
        except Exception as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
