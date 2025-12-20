from datetime import date
from decimal import Decimal
from django.db import transaction
from accounts.models import Contact
from catalog.models import Product
from pricing.models import CouponCode, PaymentTerm
from system.services import get_next_document_number
from .models import SalesOrder, SalesOrderLine, CustomerInvoice


def _calculate_totals(lines):
    subtotal = Decimal("0.00")
    tax_amount = Decimal("0.00")
    for line in lines:
        line_subtotal = Decimal(line["quantity"]) * Decimal(line["unit_price"])
        line_tax = line_subtotal * Decimal(line.get("tax_percentage", 0)) / Decimal("100")
        subtotal += line_subtotal
        tax_amount += line_tax
    return subtotal, tax_amount


@transaction.atomic
def create_checkout(data, user=None):
    customer: Contact = data["customer"]
    payment_term: PaymentTerm = data["payment_term"]
    coupon: CouponCode | None = data.get("coupon")
    lines = data["lines"]

    subtotal, tax_amount = _calculate_totals(lines)
    discount_amount = Decimal("0.00")
    applied_discount_percentage = Decimal("0.00")
    if coupon:
        applied_discount_percentage = Decimal(coupon.discount_offer.discount_percentage)
        discount_amount = subtotal * applied_discount_percentage / Decimal("100")

    total_amount = subtotal - discount_amount + tax_amount

    so_number = get_next_document_number("sales_order")
    order = SalesOrder.objects.create(
        so_number=so_number,
        customer=customer,
        payment_term=payment_term,
        order_date=date.today(),
        subtotal=subtotal,
        discount_amount=discount_amount,
        tax_amount=tax_amount,
        total_amount=total_amount,
        coupon=coupon,
        applied_discount_percentage=applied_discount_percentage,
        order_source="website",
        order_status="confirmed",
        shipping_address_line1=data.get("shipping_address_line1"),
        shipping_address_line2=data.get("shipping_address_line2"),
        shipping_city=data.get("shipping_city"),
        shipping_state=data.get("shipping_state"),
        shipping_pincode=data.get("shipping_pincode"),
        created_by=user,
    )

    for line in lines:
        product = Product.objects.get(pk=line["product_id"])
        line_subtotal = Decimal(line["quantity"]) * Decimal(line["unit_price"])
        line_tax = line_subtotal * Decimal(line.get("tax_percentage", 0)) / Decimal("100")
        line_total = line_subtotal + line_tax
        SalesOrderLine.objects.create(
            sales_order=order,
            product=product,
            line_number=line["line_number"],
            quantity=line["quantity"],
            unit_price=line["unit_price"],
            tax_percentage=line.get("tax_percentage", 0),
            line_subtotal=line_subtotal,
            line_tax_amount=line_tax,
            line_total=line_total,
        )

    invoice_number = get_next_document_number("customer_invoice")
    invoice = CustomerInvoice.objects.create(
        invoice_number=invoice_number,
        sales_order=order,
        customer=customer,
        payment_term=payment_term,
        invoice_date=date.today(),
        due_date=date.today(),
        invoice_status="confirmed",
        subtotal=subtotal,
        discount_amount=discount_amount,
        tax_amount=tax_amount,
        total_amount=total_amount,
        paid_amount=Decimal("0.00"),
        remaining_amount=total_amount,
        created_by=user,
    )

    return order, invoice
