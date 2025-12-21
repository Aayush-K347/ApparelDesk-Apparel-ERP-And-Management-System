from rest_framework import serializers
from .models import PaymentTerm, DiscountOffer, CouponCode
from accounts.models import Contact


class PaymentTermSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentTerm
        fields = "__all__"


class DiscountOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiscountOffer
        fields = "__all__"


class DiscountOfferCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiscountOffer
        fields = ["offer_name", "discount_percentage", "start_date", "end_date", "available_on", "is_active"]


class CouponCodeSerializer(serializers.ModelSerializer):
    discount_offer = DiscountOfferSerializer(read_only=True)
    contact_detail = serializers.SerializerMethodField()

    class Meta:
        model = CouponCode
        fields = [
            "coupon_id",
            "coupon_code",
            "expiration_date",
            "coupon_status",
            "usage_count",
            "max_usage_count",
            "is_active",
            "discount_offer",
            "contact",
            "contact_detail",
        ]

    def get_contact_detail(self, obj):
        if not obj.contact_id:
            return None
        return {
            "contact_id": obj.contact.contact_id,
            "contact_name": obj.contact.contact_name,
            "email": obj.contact.email,
        }


class CouponValidateSerializer(serializers.Serializer):
    code = serializers.CharField()


class CouponGenerateSerializer(serializers.Serializer):
    discount_offer_id = serializers.IntegerField()
    # for_type: anonymous, selected, all (all customers)
    for_type = serializers.ChoiceField(choices=["anonymous", "selected", "all"], default="anonymous")
    customer_ids = serializers.ListField(
        child=serializers.IntegerField(), required=False, allow_empty=True
    )
    quantity = serializers.IntegerField(required=False, min_value=1)
    # accept empty or string; parsed in view
    expiration_date = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    max_usage_count = serializers.IntegerField(required=False, min_value=1, default=1)

    def validate(self, attrs):
        for_type = attrs.get("for_type")
        customer_ids = attrs.get("customer_ids") or []
        quantity = attrs.get("quantity")
        if for_type == "selected":
            if not customer_ids:
                raise serializers.ValidationError("customer_ids required for selected type")
            attrs["quantity"] = len(customer_ids)
        elif for_type == "anonymous":
            if not quantity:
                attrs["quantity"] = 1
        else:  # all
            # generate for all active customers; we'll fetch in view
            attrs["quantity"] = None
        return attrs
