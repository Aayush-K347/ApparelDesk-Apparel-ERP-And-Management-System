from rest_framework import serializers
from accounts.models import Contact
from catalog.models import Product
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


class PurchaseOrderCreateLine(serializers.Serializer):
    product_id = serializers.IntegerField(required=False)
    product_name = serializers.CharField(required=False, allow_blank=True)
    quantity = serializers.DecimalField(max_digits=15, decimal_places=3)
    unit_price = serializers.DecimalField(max_digits=15, decimal_places=2)
    tax_percentage = serializers.DecimalField(max_digits=5, decimal_places=2, default=0)


class PurchaseOrderCreateSerializer(serializers.Serializer):
    vendor_id = serializers.IntegerField()
    expected_delivery_date = serializers.DateField(required=False)
    order_date = serializers.DateField(required=False)
    notes = serializers.CharField(required=False, allow_blank=True)
    lines = PurchaseOrderCreateLine(many=True)

    def validate_vendor_id(self, value):
        if not Contact.objects.filter(contact_id=value, contact_type__in=["vendor", "both"]).exists():
            raise serializers.ValidationError("Vendor not found")
        return value

    def validate(self, attrs):
        if not attrs.get("lines"):
            raise serializers.ValidationError("At least one line is required")
        return attrs


class VendorBillSerializer(serializers.ModelSerializer):
    vendor_detail = serializers.SerializerMethodField()
    purchase_order_number = serializers.SerializerMethodField()

    class Meta:
        model = VendorBill
        fields = "__all__"

    def get_vendor_detail(self, obj):
        if not obj.vendor_id:
            return None
        return {
            "contact_id": obj.vendor.contact_id,
            "contact_name": obj.vendor.contact_name,
            "email": obj.vendor.email,
        }

    def get_purchase_order_number(self, obj):
        return obj.purchase_order.po_number if obj.purchase_order_id else None
