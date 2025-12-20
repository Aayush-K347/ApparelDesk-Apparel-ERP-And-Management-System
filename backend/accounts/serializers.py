from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Contact, Address

User = get_user_model()


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = [
            "contact_id",
            "contact_name",
            "contact_type",
            "email",
            "mobile",
            "address_line1",
            "address_line2",
            "city",
            "state",
            "pincode",
            "country",
            "is_active",
        ]


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = [
            "address_id",
            "label",
            "address_line1",
            "address_line2",
            "city",
            "state",
            "pincode",
            "country",
            "is_default_shipping",
            "is_default_billing",
            "created_at",
            "updated_at",
        ]


class UserSerializer(serializers.ModelSerializer):
    contact = ContactSerializer(read_only=True)
    addresses = AddressSerializer(read_only=True, many=True, source="contact.addresses")

    class Meta:
        model = User
        fields = [
            "user_id",
            "username",
            "email",
            "user_role",
            "contact",
            "addresses",
            "is_active",
        ]
