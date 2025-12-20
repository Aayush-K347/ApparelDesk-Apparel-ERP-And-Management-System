from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from accounts.serializers import ContactSerializer
from .models import SalesOrder, CustomerInvoice
from .serializers import SalesOrderSerializer, CustomerInvoiceSerializer, CheckoutSerializer
from .services import create_checkout


class SalesOrderListView(generics.ListAPIView):
    serializer_class = SalesOrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SalesOrder.objects.filter(customer__users=self.request.user).order_by("-created_at")


class CustomerInvoiceListView(generics.ListAPIView):
    serializer_class = CustomerInvoiceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CustomerInvoice.objects.filter(customer__users=self.request.user).order_by("-created_at")


class CheckoutView(generics.GenericAPIView):
    serializer_class = CheckoutSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order, invoice = create_checkout(serializer.validated_data, user=request.user)
        return Response(
            {
                "order": SalesOrderSerializer(order).data,
                "invoice": CustomerInvoiceSerializer(invoice).data,
            },
            status=status.HTTP_201_CREATED,
        )


class PublicContactLookupView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        return Response(ContactSerializer(request.user.contact).data)
