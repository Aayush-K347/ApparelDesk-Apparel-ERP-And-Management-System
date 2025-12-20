from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db import transaction
from uuid import uuid4
from accounts.models import Contact
from .models import PaymentTerm, CouponCode, DiscountOffer
from .serializers import (
    PaymentTermSerializer,
    CouponCodeSerializer,
    CouponValidateSerializer,
    CouponGenerateSerializer,
    DiscountOfferSerializer,
    DiscountOfferCreateSerializer,
)


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


class DiscountOfferListView(generics.ListAPIView):
    queryset = DiscountOffer.objects.filter(is_active=True).order_by("-start_date")
    serializer_class = DiscountOfferSerializer
    permission_classes = [AllowAny]


class DiscountOfferCreateView(generics.GenericAPIView):
    serializer_class = DiscountOfferCreateSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        offer = serializer.save()
        return Response(DiscountOfferSerializer(offer).data, status=status.HTTP_201_CREATED)


class CouponListView(generics.ListAPIView):
    serializer_class = CouponCodeSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = CouponCode.objects.select_related("discount_offer", "contact").order_by("-created_at")
        offer_id = self.request.query_params.get("offer_id")
        status_filter = self.request.query_params.get("status")
        customer_id = self.request.query_params.get("customer_id")
        if offer_id:
            qs = qs.filter(discount_offer_id=offer_id)
        if status_filter:
            qs = qs.filter(coupon_status=status_filter)
        if customer_id:
            qs = qs.filter(contact_id=customer_id)
        return qs


class CouponGenerateView(generics.GenericAPIView):
    serializer_class = CouponGenerateSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            data = request.data.copy()
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            payload = serializer.validated_data

            try:
                offer = DiscountOffer.objects.get(pk=payload["discount_offer_id"], is_active=True)
            except DiscountOffer.DoesNotExist:
                return Response({"detail": "Offer not found"}, status=status.HTTP_404_NOT_FOUND)

            # normalize expiration (accept blank/None or string date)
            raw_exp = payload.get("expiration_date")
            from datetime import date as _date
            if isinstance(raw_exp, str):
                try:
                    raw_exp = _date.fromisoformat(raw_exp)
                except Exception:
                    raw_exp = None
            expiration_date = raw_exp or offer.end_date
            # Soften validation: clamp expiration within offer window
            if expiration_date < offer.start_date:
                expiration_date = offer.start_date
            if expiration_date > offer.end_date:
                expiration_date = offer.end_date

            for_type = payload["for_type"]
            max_usage = payload.get("max_usage_count") or 1

            contacts: list[Contact] = []
            quantity = payload.get("quantity") or 0
            if for_type == "selected":
                contacts = list(
                    Contact.objects.filter(contact_id__in=payload.get("customer_ids", []), is_active=True)
                )
                quantity = len(contacts)
                if quantity == 0:
                    return Response({"detail": "No selected customers found"}, status=status.HTTP_400_BAD_REQUEST)
            elif for_type == "all":
                contacts = list(Contact.objects.filter(contact_type__in=["customer", "both"], is_active=True))
                quantity = len(contacts)
                if quantity == 0:
                    # nothing to do but not an error
                    return Response({"created": [], "count": 0}, status=status.HTTP_200_OK)
            else:  # anonymous
                if quantity <= 0:
                    quantity = 1

            def generate_code():
                # short unique code
                token = uuid4().hex[:4] + "-" + uuid4().hex[:4]
                return token.upper()

            created = []
            with transaction.atomic():
                for i in range(quantity):
                    contact = contacts[i] if contacts else None
                    code = generate_code()
                    while CouponCode.objects.filter(coupon_code=code).exists():
                        code = generate_code()
                    coupon = CouponCode.objects.create(
                        discount_offer=offer,
                        coupon_code=code,
                        expiration_date=expiration_date,
                        coupon_status="unused",
                        contact=contact,
                        usage_count=0,
                        max_usage_count=max_usage,
                        is_active=True,
                    )
                    created.append(coupon)

            return Response(
                {
                    "created": CouponCodeSerializer(created, many=True).data,
                    "count": len(created),
                },
                status=status.HTTP_201_CREATED,
            )
        except Exception as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
