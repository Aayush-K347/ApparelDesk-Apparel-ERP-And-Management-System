from django.contrib import admin
from .models import SalesOrder, SalesOrderLine, CustomerInvoice


class SalesOrderLineInline(admin.TabularInline):
    model = SalesOrderLine
    extra = 1


@admin.register(SalesOrder)
class SalesOrderAdmin(admin.ModelAdmin):
    list_display = ("so_number", "customer", "order_date", "total_amount", "order_status")
    inlines = [SalesOrderLineInline]


admin.site.register(CustomerInvoice)
