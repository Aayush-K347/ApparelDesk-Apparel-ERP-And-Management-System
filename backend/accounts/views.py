import re
from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import status, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Contact, Address
from .serializers import UserSerializer, AddressSerializer

User = get_user_model()


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    @transaction.atomic
    def post(self, request):
        data = request.data
        required_fields = ["username", "email", "password", "contact_name"]
        missing = [f for f in required_fields if f not in data]
        if missing:
            return Response(
                {"detail": f"Missing fields: {', '.join(missing)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(email=data["email"]).exists():
            return Response({"detail": "Account already exists"}, status=status.HTTP_400_BAD_REQUEST)

        password = data["password"]
        if len(password) < 8 or not re.search(r"[A-Z]", password) or not re.search(r"[a-z]", password) or not re.search(r"[0-9]", password) or not re.search(r"[^A-Za-z0-9]", password):
            return Response(
                {"detail": "Password must be 8+ chars with upper, lower, number, and special char."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        contact = Contact.objects.create(
            contact_name=data["contact_name"],
            contact_type=data.get("contact_type", "customer"),
            email=data["email"],
            mobile=data.get("mobile", ""),
            address_line1=data.get("address_line1"),
            address_line2=data.get("address_line2"),
            city=data.get("city"),
            state=data.get("state"),
            pincode=data.get("pincode"),
            country=data.get("country", "India"),
        )

        user = User.objects.create_user(
            username=data["username"],
            email=data["email"],
            password=data["password"],
            contact=contact,
            user_role=data.get("user_role", "portal"),
        )

        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class VendorRegisterView(APIView):
    permission_classes = [AllowAny]

    @transaction.atomic
    def post(self, request):
        data = request.data
        required = ["username", "email", "password", "contact_name"]
        missing = [f for f in required if f not in data]
        if missing:
            return Response({"detail": f"Missing fields: {', '.join(missing)}"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=data["email"]).exists():
            return Response({"detail": "Account already exists"}, status=status.HTTP_400_BAD_REQUEST)

        password = data["password"]
        if len(password) < 8 or not re.search(r"[A-Z]", password) or not re.search(r"[a-z]", password) or not re.search(r"[0-9]", password) or not re.search(r"[^A-Za-z0-9]", password):
            return Response(
                {"detail": "Password must be 8+ chars with upper, lower, number, and special char."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        contact = Contact.objects.create(
            contact_name=data["contact_name"],
            contact_type="vendor",
            email=data["email"],
            mobile=data.get("mobile", ""),
            address_line1=data.get("address_line1"),
            address_line2=data.get("address_line2"),
            city=data.get("city"),
            state=data.get("state"),
            pincode=data.get("pincode"),
            country=data.get("country", "India"),
        )

        user = User.objects.create_user(
            username=data["username"],
            email=data["email"],
            password=data["password"],
            contact=contact,
            user_role=data.get("user_role", "internal"),
        )

        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class AddressListCreateView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(contact=self.request.user.contact).order_by("-created_at")

    def perform_create(self, serializer):
        # Only allow creating addresses for the authenticated user's contact
        serializer.save(contact=self.request.user.contact)


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "address_id"

    def get_queryset(self):
        return Address.objects.filter(contact=self.request.user.contact)
