#!/usr/bin/env bash
set -e

python manage.py migrate

if [ "${SEED_PRODUCTS}" = "true" ]; then
  python manage.py load_dump --path ../frontend/products_dump.json
fi

exec gunicorn appareldesk.wsgi:application --bind 0.0.0.0:$PORT
