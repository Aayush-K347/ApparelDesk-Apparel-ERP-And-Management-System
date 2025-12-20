from rest_framework import serializers
from accounts.models import Contact
from catalog.models import Product
from pricing.models import PaymentTerm, CouponCode
from .models import SalesOrder, SalesOrderLine, CustomerInvoice


class SalesOrderLineSerializer(serializers.ModelSerializer):
    product_detail = serializers.SerializerMethodField()

    class Meta:
        model = SalesOrderLine
        fields = [
            "so_line_id",
            "line_number",
            "product",
            "product_detail",
            "quantity",
            "unit_price",
            "tax_percentage",
            "line_subtotal",
            "line_tax_amount",
            "line_total",
        ]

    def get_product_detail(self, obj):
        return {
            "name": obj.product.product_name,
            "code": obj.product.product_code,
            "price": obj.product.sales_price,
        }


class SalesOrderSerializer(serializers.ModelSerializer):
    lines = SalesOrderLineSerializer(many=True, read_only=True)

    class Meta:
        model = SalesOrder
        fields = "__all__"


class CustomerInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerInvoice
        fields = "__all__"


class CheckoutLineSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.DecimalField(max_digits=15, decimal_places=3)
    unit_price = serializers.DecimalField(max_digits=15, decimal_places=2)
    tax_percentage = serializers.DecimalField(max_digits=5, decimal_places=2, default=0)
    line_number = serializers.IntegerField()


class CheckoutSerializer(serializers.Serializer):
    customer_id = serializers.IntegerField()
    payment_term_id = serializers.IntegerField()
    coupon_code = serializers.CharField(required=False, allow_blank=True)
    shipping_address_line1 = serializers.CharField(required=False, allow_blank=True)
    shipping_address_line2 = serializers.CharField(required=False, allow_blank=True)
    shipping_city = serializers.CharField(required=False, allow_blank=True)
    shipping_state = serializers.CharField(required=False, allow_blank=True)
    shipping_pincode = serializers.CharField(required=False, allow_blank=True)
    lines = CheckoutLineSerializer(many=True)

    def validate(self, attrs):
        # Ensure contact and payment term exist
        try:
            attrs["customer"] = Contact.objects.get(contact_id=attrs["customer_id"])
        except Contact.DoesNotExist:
            raise serializers.ValidationError("Customer not found")

        try:
            attrs["payment_term"] = PaymentTerm.objects.get(
                payment_term_id=attrs["payment_term_id"], is_active=True
            )
        except PaymentTerm.DoesNotExist:
            raise serializers.ValidationError("Payment term not found")

        coupon_code = attrs.get("coupon_code")
        if coupon_code:
            try:
                attrs["coupon"] = CouponCode.objects.get(coupon_code=coupon_code)
            except CouponCode.DoesNotExist:
                raise serializers.ValidationError("Invalid coupon")
        return attrs

    def create(self, validated_data):
        raise NotImplementedError("Use service layer to create checkout")
