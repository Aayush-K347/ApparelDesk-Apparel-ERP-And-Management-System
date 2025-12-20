from django.urls import path
from .views import (
    PurchaseOrderListView,
    PurchaseOrderCreateView,
    PurchaseOrderBillCreateView,
    VendorBillPayView,
    VendorBillListView,
    VendorListView,
)

urlpatterns = [
    path("purchase-orders/", PurchaseOrderListView.as_view(), name="purchase-orders"),
    path("purchase-orders/create/", PurchaseOrderCreateView.as_view(), name="purchase-orders-create"),
    path("purchase-orders/<int:pk>/create-bill/", PurchaseOrderBillCreateView.as_view(), name="purchase-orders-create-bill"),
    path("vendor-bills/", VendorBillListView.as_view(), name="vendor-bills"),
    path("vendor-bills/<int:pk>/pay/", VendorBillPayView.as_view(), name="vendor-bills-pay"),
    path("vendors/", VendorListView.as_view(), name="vendors"),
]
