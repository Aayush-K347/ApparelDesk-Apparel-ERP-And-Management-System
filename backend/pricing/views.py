from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import PaymentTerm, CouponCode
from .serializers import PaymentTermSerializer, CouponCodeSerializer, CouponValidateSerializer


class PaymentTermListView(generics.ListAPIView):
    queryset = PaymentTerm.objects.filter(is_active=True)
    serializer_class = PaymentTermSerializer
    permission_classes = [AllowAny]


class CouponValidateView(generics.GenericAPIView):
    serializer_class = CouponValidateSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        code = serializer.validated_data["code"].strip().upper()
        try:
            coupon = CouponCode.objects.select_related("discount_offer").get(
                coupon_code=code, is_active=True
            )
        except CouponCode.DoesNotExist:
            return Response({"valid": False, "detail": "Invalid coupon"}, status=status.HTTP_404_NOT_FOUND)

        today = timezone.now().date()
        if coupon.expiration_date < today or coupon.coupon_status == "expired":
            return Response({"valid": False, "detail": "Coupon expired"}, status=status.HTTP_400_BAD_REQUEST)

        if coupon.usage_count >= coupon.max_usage_count or coupon.coupon_status == "used":
            return Response({"valid": False, "detail": "Coupon already used"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"valid": True, "coupon": CouponCodeSerializer(coupon).data})
