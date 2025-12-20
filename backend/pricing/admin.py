from django.contrib import admin
from .models import PaymentTerm, DiscountOffer, CouponCode

admin.site.register(PaymentTerm)
admin.site.register(DiscountOffer)
admin.site.register(CouponCode)
