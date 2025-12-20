from django.urls import path
from .views import SystemSettingListView, HealthCheckView

urlpatterns = [
    path("settings/", SystemSettingListView.as_view(), name="system-settings"),
    path("health/", HealthCheckView.as_view(), name="health"),
]
