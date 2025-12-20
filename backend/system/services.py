import time
from django.db import transaction
from django.db.models import F
from django.db.utils import OperationalError, ProgrammingError
from .models import DocumentSequence


@transaction.atomic
def get_next_document_number(document_type: str) -> str:
    try:
        seq = (
            DocumentSequence.objects.select_for_update()
            .filter(document_type=document_type)
            .first()
        )
    except (OperationalError, ProgrammingError):
        # Table missing or not migrated; fall back to timestamp-based number.
        return f"{document_type.upper()}-{int(time.time())}"

    if not seq:
        seq = DocumentSequence.objects.create(
            document_type=document_type,
            prefix=document_type.upper(),
            next_number=2,
            padding=6,
        )
        number = f"{seq.prefix}-{str(1).zfill(seq.padding)}"
        return number

    number = f"{seq.prefix}-{str(seq.next_number).zfill(seq.padding)}"
    DocumentSequence.objects.filter(pk=seq.pk).update(next_number=F("next_number") + 1)
    return number
