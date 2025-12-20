from django.contrib import admin
from .models import PurchaseOrder, PurchaseOrderLine, VendorBill


class PurchaseOrderLineInline(admin.TabularInline):
    model = PurchaseOrderLine
    extra = 1


@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    list_display = ("po_number", "vendor", "order_date", "total_amount", "po_status")
    inlines = [PurchaseOrderLineInline]


admin.site.register(VendorBill)
