from django.urls import path
from .views import (
    SalesOrderListView,
    CustomerInvoiceListView,
    CheckoutView,
    PublicContactLookupView,
    SalesOrderStatusUpdateView,
    CartView,
)

urlpatterns = [
    path("orders/", SalesOrderListView.as_view(), name="sales-orders"),
    path("orders/<int:pk>/status/", SalesOrderStatusUpdateView.as_view(), name="sales-order-status"),
    path("invoices/", CustomerInvoiceListView.as_view(), name="customer-invoices"),
    path("checkout/", CheckoutView.as_view(), name="checkout"),
    path("me/contact/", PublicContactLookupView.as_view(), name="contact-lookup"),
    path("cart/", CartView.as_view(), name="cart"),
]
