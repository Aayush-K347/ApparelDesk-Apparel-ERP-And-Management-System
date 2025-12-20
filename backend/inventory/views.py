from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import StockMovement
from .serializers import StockMovementSerializer


class StockMovementListView(generics.ListAPIView):
    serializer_class = StockMovementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        product_id = self.request.query_params.get("product_id")
        qs = StockMovement.objects.all().order_by("-movement_date")
        if product_id:
            qs = qs.filter(product_id=product_id)
        return qs
