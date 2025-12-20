from django.urls import path
from .views import (
    SalesOrderListView,
    CustomerInvoiceListView,
    CheckoutView,
    PublicContactLookupView,
)

urlpatterns = [
    path("orders/", SalesOrderListView.as_view(), name="sales-orders"),
    path("invoices/", CustomerInvoiceListView.as_view(), name="customer-invoices"),
    path("checkout/", CheckoutView.as_view(), name="checkout"),
    path("me/contact/", PublicContactLookupView.as_view(), name="contact-lookup"),
]
