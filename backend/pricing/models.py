from django.db import models
from accounts.models import TimeStampedModel, Contact


class PaymentTerm(TimeStampedModel):
    COMPUTATION_CHOICES = (("base_amount", "Base Amount"), ("total_amount", "Total Amount"))

    payment_term_id = models.BigAutoField(primary_key=True)
    term_name = models.CharField(max_length=100, unique=True)
    net_days = models.IntegerField(default=0)
    early_payment_discount = models.BooleanField(default=False)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    discount_days = models.IntegerField(default=0)
    early_pay_discount_computation = models.CharField(
        max_length=20, choices=COMPUTATION_CHOICES, default="base_amount"
    )
    example_preview = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "payment_terms"
        indexes = [
            models.Index(fields=["term_name"], name="idx_term_name"),
            models.Index(fields=["is_active"], name="idx_term_active"),
        ]

    def __str__(self) -> str:
        return self.term_name


class DiscountOffer(TimeStampedModel):
    AVAIL_CHOICES = (("sales", "Sales"), ("website", "Website"), ("both", "Both"))

    discount_offer_id = models.BigAutoField(primary_key=True)
    offer_name = models.CharField(max_length=255)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    start_date = models.DateField()
    end_date = models.DateField()
    available_on = models.CharField(max_length=10, choices=AVAIL_CHOICES)
    is_active = models.BooleanField(default=True)
    created_by = models.BigIntegerField(null=True, blank=True, db_column="created_by")

    class Meta:
        db_table = "discount_offers"
        indexes = [
            models.Index(fields=["start_date", "end_date"], name="idx_offer_dates"),
            models.Index(fields=["available_on"], name="idx_offer_available"),
            models.Index(fields=["is_active"], name="idx_offer_active"),
        ]

    def __str__(self) -> str:
        return self.offer_name


class CouponCode(TimeStampedModel):
    STATUS_CHOICES = (("unused", "Unused"), ("used", "Used"), ("expired", "Expired"))

    coupon_id = models.BigAutoField(primary_key=True)
    discount_offer = models.ForeignKey(
        DiscountOffer, on_delete=models.CASCADE, related_name="coupons"
    )
    coupon_code = models.CharField(max_length=50, unique=True)
    expiration_date = models.DateField()
    coupon_status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="unused")
    contact = models.ForeignKey(
        Contact, on_delete=models.SET_NULL, null=True, blank=True, related_name="coupons"
    )
    usage_count = models.IntegerField(default=0)
    max_usage_count = models.IntegerField(default=1)
    is_active = models.BooleanField(default=True)
    used_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = "coupon_codes"
        indexes = [
            models.Index(fields=["coupon_code"], name="idx_coupon_code"),
            models.Index(fields=["coupon_status"], name="idx_coupon_status"),
            models.Index(fields=["contact"], name="idx_coupon_contact"),
            models.Index(fields=["expiration_date"], name="idx_coupon_expiration"),
        ]

    def __str__(self) -> str:
        return self.coupon_code
