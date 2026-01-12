import json
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import connection, transaction


def map_type(cat: str) -> str:
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
    help = "Load products_dump.json into products/product_colors/product_images using raw SQL (bypasses created_at/updated_at columns)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--path",
            default="../frontend/products_dump.json",
            help="Path to products_dump.json (default: ../frontend/products_dump.json)",
        )

    def handle(self, *args, **options):
        path = Path(options["path"]).resolve()
        if not path.exists():
            raise CommandError(f"File not found: {path}")

        data = json.loads(path.read_text(encoding="utf-8"))

        with transaction.atomic(), connection.cursor() as cur:
            cur.execute("DELETE FROM product_images")
            cur.execute("DELETE FROM product_colors")
            cur.execute("DELETE FROM products")

            for idx, p in enumerate(data, start=1):
                insert_sql = """
                    INSERT INTO products
                    (product_name, product_code, product_category, product_type, material, description,
                     current_stock, minimum_stock, sales_price, sales_tax_percentage, purchase_price,
                     purchase_tax_percentage, is_published, is_active, created_at, updated_at)
                    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
                    """
                params = [
                    p["name"],
                    p.get("sku") or f"LUV-{idx:05d}",
                    p.get("gender", "unisex").lower(),
                    map_type(p.get("category")),
                    p.get("material") or "Cotton",
                    p.get("description") or "",
                    50,
                    5,
                    p["price"],
                    0,
                    float(p["price"]) * 0.6,
                    0,
                    True,
                    True,
                ]

                if connection.features.can_return_columns_from_insert:
                    cur.execute(insert_sql + " RETURNING id", params)
                    product_id = cur.fetchone()[0]
                else:
                    cur.execute(insert_sql, params)
                    product_id = cur.lastrowid

                seen = set()
                for c in p.get("colors", []):
                    norm = (c or "").strip()
                    key = norm.lower()
                    if not norm or key in seen:
                        continue
                    seen.add(key)
                    cur.execute(
                        """
                        INSERT INTO product_colors (product_id, color_name, color_code, display_order, is_active)
                        VALUES (%s,%s,%s,%s,%s)
                        """,
                        [product_id, norm, None, 0, True],
                    )

                imgs = p.get("images") or [p.get("image")]
                for i_order, img in enumerate(imgs):
                    if not img:
                        continue
                    cur.execute(
                        """
                        INSERT INTO product_images (product_id, image_url, image_alt_text, display_order, is_primary, is_active)
                        VALUES (%s,%s,%s,%s,%s,%s)
                        """,
                        [product_id, img, p["name"], i_order, i_order == 0, True],
                    )

        self.stdout.write(self.style.SUCCESS(f"Imported {len(data)} products from {path}"))
