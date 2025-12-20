from django.contrib import admin
from .models import Product, ProductColor, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductColorInline(admin.TabularInline):
    model = ProductColor
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("product_name", "product_code", "product_category", "product_type", "sales_price", "is_published")
    search_fields = ("product_name", "product_code", "description")
    list_filter = ("product_category", "product_type", "is_published", "is_active")
    inlines = [ProductColorInline, ProductImageInline]


admin.site.register(ProductColor)
admin.site.register(ProductImage)
