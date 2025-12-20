from django.urls import path
from .views import PurchaseOrderListView, VendorBillListView

urlpatterns = [
    path("purchase-orders/", PurchaseOrderListView.as_view(), name="purchase-orders"),
    path("vendor-bills/", VendorBillListView.as_view(), name="vendor-bills"),
]
