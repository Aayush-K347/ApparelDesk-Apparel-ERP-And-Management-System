from rest_framework import generics, filters
from rest_framework.permissions import AllowAny
from .models import Product
from .serializers import ProductSerializer


class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    queryset = Product.objects.filter(is_active=True, is_published=True).prefetch_related(
        "colors", "images"
    )
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["product_name", "product_code", "description"]
    ordering_fields = ["sales_price", "product_name", "popularity"]

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
    queryset = Product.objects.filter(is_active=True).prefetch_related("colors", "images")
