from django.core.management.base import BaseCommand
from pricing.models import PaymentTerm
from system.models import DocumentSequence, SystemSetting


class Command(BaseCommand):
    help = "Seed default payment terms, document sequences, and system settings"

    def handle(self, *args, **options):
        payment_terms = [
            ("Immediate Payment", 0, False, "Payment Terms: Immediate Payment"),
            ("Net 15", 15, False, "Payment Terms: Net 15 days"),
            ("Net 30", 30, False, "Payment Terms: Net 30 days"),
            ("Net 45", 45, False, "Payment Terms: Net 45 days"),
        ]
        for name, net_days, early_discount, preview in payment_terms:
            PaymentTerm.objects.get_or_create(
                term_name=name,
                defaults={
                    "net_days": net_days,
                    "early_payment_discount": early_discount,
                    "example_preview": preview,
                },
            )

        sequences = [
            ("purchase_order", "PO"),
            ("vendor_bill", "BILL"),
            ("sales_order", "SO"),
            ("customer_invoice", "INV"),
            ("payment", "PAY"),
        ]
        for doc, prefix in sequences:
            DocumentSequence.objects.get_or_create(
                document_type=doc,
                defaults={"prefix": prefix, "next_number": 1, "padding": 6},
            )

        settings = [
            ("automatic_invoicing", "false", "boolean", "Automatically create customer invoice after website payment"),
            ("tax_calculation_method", "inclusive", "string", "Tax calculation method: inclusive or exclusive"),
            ("default_currency", "INR", "string", "Default currency code"),
            ("stock_warning_threshold", "10", "number", "Minimum stock level for warnings"),
            ("session_timeout_minutes", "30", "number", "User session timeout in minutes"),
        ]
        for key, value, setting_type, desc in settings:
            SystemSetting.objects.get_or_create(
                setting_key=key,
                defaults={"setting_value": value, "setting_type": setting_type, "description": desc},
            )

        self.stdout.write(self.style.SUCCESS("Default data seeded"))
