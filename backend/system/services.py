from django.db import transaction
from django.db.models import F
from .models import DocumentSequence


@transaction.atomic
def get_next_document_number(document_type: str) -> str:
    seq = (
        DocumentSequence.objects.select_for_update()
        .filter(document_type=document_type)
        .first()
    )
    if not seq:
        raise ValueError(f"Document sequence not configured for {document_type}")

    number = f"{seq.prefix}-{str(seq.next_number).zfill(seq.padding)}"
    DocumentSequence.objects.filter(pk=seq.pk).update(next_number=F("next_number") + 1)
    return number
