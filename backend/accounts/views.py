from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Contact
from .serializers import UserSerializer

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
