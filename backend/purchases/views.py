from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import PurchaseOrder, VendorBill
from .serializers import PurchaseOrderSerializer, VendorBillSerializer


class PurchaseOrderListView(generics.ListAPIView):
    serializer_class = PurchaseOrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        vendor_id = self.request.query_params.get("vendor_id")
        qs = PurchaseOrder.objects.all().order_by("-created_at")
        if vendor_id:
            qs = qs.filter(vendor_id=vendor_id)
        return qs


class VendorBillListView(generics.ListAPIView):
    serializer_class = VendorBillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        vendor_id = self.request.query_params.get("vendor_id")
        qs = VendorBill.objects.all().order_by("-created_at")
        if vendor_id:
            qs = qs.filter(vendor_id=vendor_id)
        return qs
