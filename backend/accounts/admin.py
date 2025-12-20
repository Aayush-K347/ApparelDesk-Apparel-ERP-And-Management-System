from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Contact, User


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ("contact_name", "contact_type", "email", "mobile", "is_active")
    search_fields = ("contact_name", "email", "mobile")
    list_filter = ("contact_type", "is_active")


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    model = User
    list_display = ("username", "email", "user_role", "contact", "is_active")
    list_filter = ("user_role", "is_active", "is_staff", "is_superuser")
    search_fields = ("username", "email")
    ordering = ("username",)
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Personal info", {"fields": ("email", "contact", "mobile")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
        ("Roles", {"fields": ("user_role",)}),
    )
