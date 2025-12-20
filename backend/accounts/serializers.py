from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Contact

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


class UserSerializer(serializers.ModelSerializer):
    contact = ContactSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            "user_id",
            "username",
            "email",
            "user_role",
            "contact",
            "is_active",
        ]
