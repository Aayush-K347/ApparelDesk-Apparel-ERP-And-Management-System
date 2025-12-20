from rest_framework import serializers
from .models import PurchaseOrder, PurchaseOrderLine, VendorBill


class PurchaseOrderLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseOrderLine
        fields = "__all__"


class PurchaseOrderSerializer(serializers.ModelSerializer):
    lines = PurchaseOrderLineSerializer(many=True, read_only=True)

    class Meta:
        model = PurchaseOrder
        fields = "__all__"


class VendorBillSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorBill
        fields = "__all__"
