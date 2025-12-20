from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from accounts.serializers import ContactSerializer
from accounts.models import Contact
from catalog.models import Product
from .models import SalesOrder, CustomerInvoice, Cart, CartItem
from .serializers import SalesOrderSerializer, CustomerInvoiceSerializer, CheckoutSerializer, CartSerializer
from .services import create_checkout
from django.shortcuts import get_object_or_404


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
        data = request.data.copy()
        # enforce using the logged-in user's contact
        if request.user and getattr(request.user, "contact_id", None):
            data["customer_id"] = request.user.contact_id
        elif request.user and request.user.is_authenticated:
            # create a contact if missing for the user
            contact = Contact.objects.create(
                contact_name=request.user.username or request.user.email or "Customer",
                contact_type="customer",
                email=request.user.email or f"user-{request.user.user_id}@example.com",
                mobile="",
            )
            request.user.contact = contact
            request.user.save(update_fields=["contact"])
            data["customer_id"] = contact.contact_id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        try:
            order, invoice = create_checkout(serializer.validated_data, user=request.user)
        except Exception as exc:  # pragma: no cover - defensive
            # Surface the error to the client instead of a 500
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
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


class SalesOrderStatusUpdateView(generics.GenericAPIView):
    serializer_class = SalesOrderSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk, *args, **kwargs):
        order = get_object_or_404(
            SalesOrder.objects.filter(customer__users=request.user), pk=pk
        )
        new_status = request.data.get("order_status")
        allowed = {"confirmed", "invoiced", "completed", "cancelled"}
        if new_status not in allowed:
            return Response({"detail": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
        previous_status = order.order_status
        order.order_status = new_status
        order.save(update_fields=["order_status"])
        # Log the change
        from .models import SalesOrderStatusLog

        SalesOrderStatusLog.objects.create(
            sales_order=order,
            previous_status=previous_status,
            new_status=new_status,
            changed_by=request.user,
            note="Updated by customer",
        )
        return Response(SalesOrderSerializer(order).data)


class CartView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CartSerializer

    def get_cart(self, user):
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart

    def get(self, request, *args, **kwargs):
        cart = self.get_cart(request.user)
        return Response(CartSerializer(cart).data)

    def post(self, request, *args, **kwargs):
        cart = self.get_cart(request.user)
        items = request.data.get("items")
        if items is None or not isinstance(items, list):
            return Response({"detail": "items must be a list"}, status=status.HTTP_400_BAD_REQUEST)
        cart.items.all().delete()
        created_items = []
        for item in items:
            try:
                product_id = int(item.get("product_id"))
                quantity = item.get("quantity")
            except Exception:
                return Response({"detail": "Invalid product or quantity"}, status=status.HTTP_400_BAD_REQUEST)
            if not product_id or quantity is None:
                return Response({"detail": "product_id and quantity are required"}, status=status.HTTP_400_BAD_REQUEST)
            product = Product.objects.filter(pk=product_id).first()
            if not product:
                return Response({"detail": f"Product {product_id} not found"}, status=status.HTTP_400_BAD_REQUEST)
            created_items.append(
                CartItem(
                    cart=cart,
                    product=product,
                    quantity=quantity,
                    selected_size=item.get("selected_size") or "",
                    selected_color=item.get("selected_color") or "",
                )
            )
        CartItem.objects.bulk_create(created_items)
        cart.refresh_from_db()
        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)
