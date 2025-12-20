from rest_framework import serializers
from accounts.models import Contact
from catalog.models import Product
from pricing.models import PaymentTerm, CouponCode
from .models import SalesOrder, SalesOrderLine, CustomerInvoice, SalesOrderStatusLog, Cart, CartItem
import time
from accounts.models import Address


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
    status_logs = serializers.SerializerMethodField()

    class Meta:
        model = SalesOrder
        fields = "__all__"

    def get_status_logs(self, obj):
        return [
            {
                "previous_status": log.previous_status,
                "new_status": log.new_status,
                "changed_at": log.created_at,
                "note": log.note,
            }
            for log in obj.status_logs.order_by("-created_at")
        ]


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
    customer_id = serializers.IntegerField(required=False)
    payment_term_id = serializers.IntegerField()
    coupon_code = serializers.CharField(required=False, allow_blank=True)
    address_id = serializers.IntegerField(required=False)
    shipping_address_line1 = serializers.CharField(required=False, allow_blank=True)
    shipping_address_line2 = serializers.CharField(required=False, allow_blank=True)
    shipping_city = serializers.CharField(required=False, allow_blank=True)
    shipping_state = serializers.CharField(required=False, allow_blank=True)
    shipping_pincode = serializers.CharField(required=False, allow_blank=True)
    shipping_country = serializers.CharField(required=False, allow_blank=True)
    lines = CheckoutLineSerializer(many=True)

    def validate(self, attrs):
        if not attrs.get("lines"):
            raise serializers.ValidationError("No order lines provided")
        # ensure products exist, auto-create placeholders if missing
        for line in attrs["lines"]:
            pid = line.get("product_id")
            product = Product.objects.filter(pk=pid).first()
            if not product:
                suffix = str(int(time.time()))
                code = f"AUTO-{pid}-{suffix}"
                # ensure uniqueness
                while Product.objects.filter(product_code=code).exists():
                    suffix = str(int(time.time()))
                    code = f"AUTO-{pid}-{suffix}"
                product = Product.objects.create(
                    product_name=f"Auto Product {pid}",
                    product_code=code,
                    product_category="unisex",
                    product_type="other",
                    sales_price=line.get("unit_price", 0) or 0,
                    sales_tax_percentage=line.get("tax_percentage", 0) or 0,
                    purchase_price=line.get("unit_price", 0) or 0,
                    purchase_tax_percentage=line.get("tax_percentage", 0) or 0,
                )
                line["product_id"] = product.product_id

        # Ensure contact and payment term exist
        try:
            attrs["customer"] = Contact.objects.get(contact_id=attrs["customer_id"])
        except Contact.DoesNotExist:
            raise serializers.ValidationError("Customer not found")

        payment_term = PaymentTerm.objects.filter(
            payment_term_id=attrs.get("payment_term_id"), is_active=True
        ).first()
        if not payment_term:
            payment_term = PaymentTerm.objects.filter(is_active=True).first()
        if not payment_term:
            payment_term = PaymentTerm.objects.create(term_name="Immediate", net_days=0, is_active=True)
        attrs["payment_term"] = payment_term

        coupon_code = attrs.get("coupon_code")
        if coupon_code:
            try:
                attrs["coupon"] = CouponCode.objects.get(coupon_code=coupon_code)
            except CouponCode.DoesNotExist:
                raise serializers.ValidationError("Invalid coupon")

        address_id = attrs.get("address_id")
        if address_id:
            try:
                attrs["address"] = Address.objects.get(address_id=address_id, contact=attrs["customer"])
            except Address.DoesNotExist:
                raise serializers.ValidationError("Invalid address")
        return attrs

    def create(self, validated_data):
        raise NotImplementedError("Use service layer to create checkout")


class CartItemSerializer(serializers.ModelSerializer):
    product_detail = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            "cart_item_id",
            "product",
            "quantity",
            "selected_size",
            "selected_color",
            "product_detail",
        ]

    def get_product_detail(self, obj):
        product = obj.product
        first_image = product.images.first().image_url if hasattr(product, "images") and product.images.exists() else ""
        return {
            "name": product.product_name,
            "code": product.product_code,
            "price": product.sales_price,
            "image": first_image,
        }


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ["cart_id", "items"]
