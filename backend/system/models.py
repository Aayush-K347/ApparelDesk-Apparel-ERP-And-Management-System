from django.db import models
from django.conf import settings


class SystemSetting(models.Model):
    TYPE_CHOICES = (("string", "String"), ("number", "Number"), ("boolean", "Boolean"), ("json", "JSON"))

    setting_id = models.BigAutoField(primary_key=True)
    setting_key = models.CharField(max_length=100, unique=True)
    setting_value = models.TextField(blank=True, null=True)
    setting_type = models.CharField(max_length=10, choices=TYPE_CHOICES, default="string")
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.BigIntegerField(null=True, blank=True, db_column="updated_by")

    class Meta:
        db_table = "system_settings"
        indexes = [models.Index(fields=["setting_key"], name="idx_setting_key")]

    def __str__(self) -> str:
        return self.setting_key


class AuditLog(models.Model):
    ACTION_CHOICES = (("INSERT", "INSERT"), ("UPDATE", "UPDATE"), ("DELETE", "DELETE"))

    audit_id = models.BigAutoField(primary_key=True)
    table_name = models.CharField(max_length=100)
    record_id = models.BigIntegerField()
    action_type = models.CharField(max_length=10, choices=ACTION_CHOICES)
    old_values = models.JSONField(blank=True, null=True)
    new_values = models.JSONField(blank=True, null=True)
    changed_by = models.BigIntegerField(null=True, blank=True)
    changed_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.CharField(max_length=45, blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "audit_log"
        indexes = [
            models.Index(fields=["table_name", "record_id"], name="idx_audit_table_record"),
            models.Index(fields=["changed_at"], name="idx_audit_changed_at"),
            models.Index(fields=["changed_by"], name="idx_audit_changed_by"),
        ]

    def __str__(self) -> str:
        return f"{self.table_name} {self.action_type}"


class DocumentSequence(models.Model):
    sequence_id = models.BigAutoField(primary_key=True)
    document_type = models.CharField(max_length=50, unique=True)
    prefix = models.CharField(max_length=20)
    next_number = models.BigIntegerField(default=1)
    padding = models.IntegerField(default=6)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "document_sequences"
        indexes = [models.Index(fields=["document_type"], name="idx_doc_type")]

    def __str__(self) -> str:
        return f"{self.document_type} {self.prefix}-{self.next_number}"
