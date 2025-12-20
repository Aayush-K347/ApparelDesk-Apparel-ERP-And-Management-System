import json
from pathlib import Path
from django.core.management.base import BaseCommand
from django.db import transaction
from catalog.models import Product, ProductImage, ProductColor


def map_type(cat: str) -> str:
    """Map category string to product type enum."""
    c = (cat or "").lower()
    if "t-shirt" in c or "tee" in c:
        return "t-shirt"
    if "shirt" in c:
        return "shirt"
    if "jean" in c:
        return "jeans"
    if "pant" in c or "trouser" in c or "bottom" in c:
        return "pant"
    if "kurta" in c:
        return "kurta"
    if "dress" in c:
        return "dress"
    return "other"


class Command(BaseCommand):
    help = "Seed products from frontend/products_dump.json"

    def add_arguments(self, parser):
        parser.add_argument(
            "--dump-path",
            type=str,
            default="../frontend/products_dump.json",
            help="Path to products_dump.json (relative to manage.py)",
        )
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Delete existing products before seeding",
        )

    def handle(self, *args, **options):
        dump_path = Path(options["dump_path"])
        if not dump_path.is_absolute():
            dump_path = Path(__file__).resolve().parent.parent.parent.parent / dump_path

        if not dump_path.exists():
            self.stdout.write(
                self.style.ERROR(f"products_dump.json not found at {dump_path}")
            )
            return

        with open(dump_path) as f:
            data = json.load(f)

        self.stdout.write(
            self.style.SUCCESS(f"Loaded {len(data)} products from {dump_path}")
        )

        with transaction.atomic():
            if options["clear"]:
                ProductImage.objects.all().delete()
                ProductColor.objects.all().delete()
                Product.objects.all().delete()
                self.stdout.write(self.style.WARNING("Cleared existing products"))

            created_count = 0
            skipped_count = 0

            for idx, p in enumerate(data, start=1):
                product_code = p.get("sku") or f"LUV-{idx:05d}"

                # Skip if product already exists
                if Product.objects.filter(product_code=product_code).exists():
                    skipped_count += 1
                    continue

                try:
                    prod = Product.objects.create(
                        product_name=p.get("name", f"Product {idx}"),
                        product_code=product_code,
                        product_category=p.get("gender", "unisex").lower(),
                        product_type=map_type(p.get("category", "")),
                        material=p.get("material") or "Cotton",
                        description=p.get("description") or "",
                        current_stock=50,
                        minimum_stock=5,
                        sales_price=float(p.get("price", 0)),
                        sales_tax_percentage=0,
                        purchase_price=float(p.get("price", 0)) * 0.6,
                        purchase_tax_percentage=0,
                        is_published=True,
                        is_active=True,
                    )

                    # Add colors
                    seen_colors = set()
                    for c in p.get("colors", []):
                        norm = (c or "").strip()
                        key = norm.lower()
                        if not norm or key in seen_colors:
                            continue
                        seen_colors.add(key)
                        ProductColor.objects.create(product=prod, color_name=norm)

                    # Add images
                    imgs = p.get("images") or [p.get("image")]
                    for i_order, img in enumerate(imgs or []):
                        if not img:
                            continue
                        ProductImage.objects.create(
                            product=prod,
                            image_url=img,
                            image_alt_text=prod.product_name,
                            display_order=i_order,
                            is_primary=(i_order == 0),
                            is_active=True,
                        )

                    created_count += 1

                except Exception as exc:
                    self.stdout.write(
                        self.style.ERROR(f"Error creating product {idx}: {exc}")
                    )

        self.stdout.write(
            self.style.SUCCESS(
                f"✓ Created {created_count} products, skipped {skipped_count} (already exist)"
            )
        )