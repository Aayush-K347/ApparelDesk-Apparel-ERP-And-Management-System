from django.urls import path
from .views import ProductListView, ProductDetailView, VendorProductListCreateView

urlpatterns = [
    path("products/", ProductListView.as_view(), name="product-list"),
    path("products/<int:product_id>/", ProductDetailView.as_view(), name="product-detail"),
    path("vendor/products/", VendorProductListCreateView.as_view(), name="vendor-product-list-create"),
]
