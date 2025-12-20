from django.contrib import admin
from .models import SystemSetting, AuditLog, DocumentSequence

admin.site.register(SystemSetting)
admin.site.register(AuditLog)
admin.site.register(DocumentSequence)
