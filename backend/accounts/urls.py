from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    ProfileView,
    RegisterView,
    VendorRegisterView,
    AddressListCreateView,
    AddressDetailView,
    PortalUsersListView,
    PortalUserDetailView,
    CustomersListView,
    VendorsListView,
)

urlpatterns = [
    path("auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/vendor/register/", VendorRegisterView.as_view(), name="vendor-register"),
    path("auth/profile/", ProfileView.as_view(), name="profile"),
    path("auth/addresses/", AddressListCreateView.as_view(), name="address-list-create"),
    path(
        "auth/addresses/<int:address_id>/",
        AddressDetailView.as_view(),
        name="address-detail",
    ),
    path("users/portal/", PortalUsersListView.as_view(), name="portal-users-list"),
    path("users/portal/<int:contact_id>/", PortalUserDetailView.as_view(), name="portal-user-detail"),
    path("contacts/customers/", CustomersListView.as_view(), name="customers-list"),
    path("contacts/vendors/", VendorsListView.as_view(), name="vendors-list"),
]
