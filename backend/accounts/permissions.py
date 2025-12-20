from rest_framework.permissions import BasePermission


class IsVendorUser(BasePermission):
    """
    Allows access to users flagged as vendor/both or internal/staff.
    """

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if user.is_staff or user.is_superuser:
            return True
        # internal role or vendor/both contact
        if getattr(user, "user_role", None) == "internal":
            return True
        contact = getattr(user, "contact", None)
        if contact and contact.contact_type in ("vendor", "both"):
            return True
        return False
