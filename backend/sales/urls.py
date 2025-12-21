from django.urls import path
from .views import (
    SalesOrderListView,
    SalesOrderDetailView,
    CustomerInvoiceListView,
    VendorInvoiceListView,
    CheckoutView,
    PublicContactLookupView,
    SalesOrderStatusUpdateView,
    CartView,
    CustomerListForOrdersView,
)

urlpatterns = [
    path("orders/", SalesOrderListView.as_view(), name="sales-orders"),
    path("orders/<int:pk>/", SalesOrderDetailView.as_view(), name="sales-order-detail"),
    path("orders/<int:pk>/status/", SalesOrderStatusUpdateView.as_view(), name="sales-order-status"),
    path("invoices/", CustomerInvoiceListView.as_view(), name="customer-invoices"),
    path("vendor/invoices/", VendorInvoiceListView.as_view(), name="vendor-invoices"),
    path("checkout/", CheckoutView.as_view(), name="checkout"),
    path("me/contact/", PublicContactLookupView.as_view(), name="contact-lookup"),
    path("customers/", CustomerListForOrdersView.as_view(), name="order-customers"),
    path("cart/", CartView.as_view(), name="cart"),
]
