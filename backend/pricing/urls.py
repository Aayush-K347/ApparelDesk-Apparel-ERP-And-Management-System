from django.urls import path
from .views import (
    PaymentTermListView,
    CouponValidateView,
    DiscountOfferListView,
    DiscountOfferCreateView,
    CouponListView,
    CouponGenerateView,
)

urlpatterns = [
    path("payment-terms/", PaymentTermListView.as_view(), name="payment-terms"),
    path("coupons/validate/", CouponValidateView.as_view(), name="coupon-validate"),
    path("offers/", DiscountOfferListView.as_view(), name="offers"),
    path("offers/create/", DiscountOfferCreateView.as_view(), name="offers-create"),
    path("coupons/", CouponListView.as_view(), name="coupon-list"),
    path("coupons/generate/", CouponGenerateView.as_view(), name="coupon-generate"),
]
