from rest_framework import serializers
from .models import PaymentTerm, DiscountOffer, CouponCode


class PaymentTermSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentTerm
        fields = "__all__"


class DiscountOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiscountOffer
        fields = "__all__"


class CouponCodeSerializer(serializers.ModelSerializer):
    discount_offer = DiscountOfferSerializer(read_only=True)

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
        ]


class CouponValidateSerializer(serializers.Serializer):
    code = serializers.CharField()
