from app.workers.celery_app import celery_app
from app.database import SessionLocal
import logging
import asyncio
import random
import time

logger = logging.getLogger(__name__)

@celery_app.task(bind=True, max_retries=3)
def start_auto_browse(self, user_id: str):
    """Main task: Browse 25 channels for new member"""
    db = SessionLocal()
    try:
        from app.services.tree_service import TreeService
        from app.automation.browser_engine import BrowserEngine
        from app.models.browse_log import BrowseLog
        from app.config import settings

        tree_service = TreeService(db)
        channels = tree_service.get_upward_path(user_id, max_levels=5)

        logger.info(f"Starting browse for user {user_id}: {len(channels)} channels")

        engine = BrowserEngine()

        for i, channel in enumerate(channels):
            logger.info(f"[{i+1}/{len(channels)}] Visiting: {channel['channel_name']}")

            result = asyncio.run(engine.visit_channel(channel['youtube_url']))

            log = BrowseLog(
                user_id=user_id,
                channel_id=channel['channel_id'],
                action="browse",
                status=result['status'],
                message=str(result.get('actions', []))
            )
            db.add(log)
            db.commit()

            delay = random.uniform(settings.MIN_DELAY_SECONDS, settings.MAX_DELAY_SECONDS)
            logger.info(f"Waiting {delay:.0f}s...")
            time.sleep(delay)

        logger.info(f"Browse complete for user {user_id}")

    except Exception as e:
        logger.error(f"Browse error for {user_id}: {e}")
        raise self.retry(exc=e, countdown=60)
    finally:
        db.close()

@celery_app.task
def send_daily_reports():
    """Send daily reports to all users"""
    logger.info("Sending daily reports...")
