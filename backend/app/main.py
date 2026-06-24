from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("MoneyTree API Starting...")
    try:
        from app.database import engine, Base
        if engine:
            Base.metadata.create_all(bind=engine)
            logger.info("Database tables created")
    except Exception as e:
        logger.warning(f"Database setup skipped: {e}")
    yield
    # Shutdown
    logger.info("MoneyTree API Shutting down...")


app = FastAPI(
    title="MoneyTree Network API",
    description="YouTube Channel Growth Network System",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "app": "MoneyTree Network",
        "status": "running",
        "version": "1.0.0",
        "message": "Welcome to Money Tree API!"
    }


@app.get("/health")
async def health():
    db_status = "unknown"
    try:
        from app.database import engine
        if engine:
            with engine.connect() as conn:
                conn.execute("SELECT 1")
            db_status = "connected"
        else:
            db_status = "not configured"
    except Exception as e:
        db_status = f"error: {str(e)[:50]}"

    return {
        "status": "healthy",
        "database": db_status,
        "port": os.environ.get("PORT", "8000")
    }


@app.get("/api/status")
async def status():
    return {
        "api": "online",
        "version": "1.0.0",
        "features": [
            "Tree-based referral system",
            "Auto-browse 25 channels",
            "Points and rewards",
            "Revenue tracking",
            "Leaderboard",
            "Custom vanity URLs",
            "Multi-platform support"
        ]
    }
