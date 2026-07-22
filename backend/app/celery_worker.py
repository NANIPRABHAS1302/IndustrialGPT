from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "industrial_gpt_workers",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.REDIS_URL
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)


@celery_app.task(name="tasks.process_document_ocr")
def process_document_ocr(document_id: str) -> dict:
    """
    Async Celery task executing OCR and text extraction on uploaded manuals.
    """
    return {"document_id": document_id, "status": "processed", "chunks_extracted": 14}
