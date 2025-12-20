from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Contact(TimeStampedModel):
    CONTACT_TYPES = (
        ("customer", "Customer"),
        ("vendor", "Vendor"),
        ("both", "Both"),
    )

    contact_id = models.BigAutoField(primary_key=True)
    contact_name = models.CharField(max_length=255)
    contact_type = models.CharField(max_length=10, choices=CONTACT_TYPES)
    email = models.EmailField(max_length=255, unique=True)
    mobile = models.CharField(
        max_length=20,
        validators=[RegexValidator(r"^[0-9+() -]+$", "Invalid mobile format")],
    )
    address_line1 = models.CharField(max_length=255, blank=True, null=True)
    address_line2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    pincode = models.CharField(max_length=10, blank=True, null=True)
    country = models.CharField(max_length=100, default="India")
    is_active = models.BooleanField(default=True)
    created_by = models.BigIntegerField(blank=True, null=True)
    updated_by = models.BigIntegerField(blank=True, null=True)

    class Meta:
        db_table = "contacts"
        indexes = [
            models.Index(fields=["email"], name="idx_email"),
            models.Index(fields=["mobile"], name="idx_mobile"),
            models.Index(fields=["contact_type"], name="idx_contact_type"),
            models.Index(fields=["is_active"], name="idx_contact_active"),
        ]

    def __str__(self) -> str:
        return f"{self.contact_name} ({self.contact_type})"


class User(AbstractUser, TimeStampedModel):
    USER_ROLES = (
        ("internal", "Internal"),
        ("portal", "Portal"),
    )

    user_id = models.BigAutoField(primary_key=True)
    contact = models.ForeignKey(
        Contact,
        on_delete=models.PROTECT,
        related_name="users",
        null=True,
        blank=True,
    )
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(max_length=255, unique=True)
    user_role = models.CharField(max_length=10, choices=USER_ROLES)
    mobile = models.CharField(max_length=20, blank=True, null=True)
    address_line1 = models.CharField(max_length=255, blank=True, null=True)
    address_line2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    pincode = models.CharField(max_length=10, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    last_login = models.DateTimeField(blank=True, null=True)
    failed_login_attempts = models.IntegerField(default=0)
    account_locked_until = models.DateTimeField(blank=True, null=True)
    email_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=64, blank=True, null=True)
    password_reset_token = models.CharField(max_length=64, blank=True, null=True)
    password_reset_expires = models.DateTimeField(blank=True, null=True)

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    class Meta:
        db_table = "users"
        indexes = [
            models.Index(fields=["username"], name="idx_username"),
            models.Index(fields=["email"], name="idx_user_email"),
            models.Index(fields=["user_role"], name="idx_user_role"),
            models.Index(fields=["is_active"], name="idx_user_active"),
            models.Index(fields=["contact"], name="idx_user_contact"),
        ]

    def __str__(self) -> str:
        return self.username


class Address(TimeStampedModel):
    address_id = models.BigAutoField(primary_key=True)
    contact = models.ForeignKey(
        Contact, on_delete=models.CASCADE, related_name="addresses", db_constraint=False
    )
    label = models.CharField(max_length=100, default="Home")
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100, blank=True, null=True)
    pincode = models.CharField(max_length=10, blank=True, null=True)
    country = models.CharField(max_length=100, default="India")
    is_default_shipping = models.BooleanField(default=False)
    is_default_billing = models.BooleanField(default=False)

    class Meta:
        db_table = "addresses"
        indexes = [
            models.Index(fields=["contact"], name="idx_address_contact"),
            models.Index(fields=["is_default_shipping"], name="idx_address_ship"),
            models.Index(fields=["is_default_billing"], name="idx_address_bill"),
        ]

    def __str__(self) -> str:
        return f"{self.label} - {self.address_line1}"
