from django.urls import path
from .views import PaymentTermListView, CouponValidateView

urlpatterns = [
    path("payment-terms/", PaymentTermListView.as_view(), name="payment-terms"),
    path("coupons/validate/", CouponValidateView.as_view(), name="coupon-validate"),
]
