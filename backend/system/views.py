from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import SystemSetting
from .serializers import SystemSettingSerializer


class SystemSettingListView(generics.ListAPIView):
    queryset = SystemSetting.objects.filter(is_active=True)
    serializer_class = SystemSettingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class HealthCheckView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, *args, **kwargs):
        return Response({"status": "ok"})
