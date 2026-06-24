from celery import Celery
from app.config import settings

celery_app = Celery(
    "money_tree",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["app.workers.tasks"]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    beat_schedule={
        "daily-report": {
            "task": "app.workers.tasks.send_daily_reports",
            "schedule": 86400.0,
        },
    },
)
