import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = os.environ.get(
        "DATABASE_URL",
        "postgresql://postgres:password@localhost:5432/moneytree"
    )
    REDIS_URL: str = os.environ.get(
        "REDIS_URL",
        "redis://localhost:6379/0"
    )

    # Security
    SECRET_KEY: str = os.environ.get(
        "SECRET_KEY",
        "change-this-secret-key-minimum-32-characters"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080

    # Admin
    ADMIN_EMAIL: str = os.environ.get("ADMIN_EMAIL", "admin@example.com")
    ADMIN_PASSWORD: str = os.environ.get("ADMIN_PASSWORD", "admin123")

    # App
    APP_NAME: str = os.environ.get("APP_NAME", "MoneyTree Network")
    BASE_URL: str = os.environ.get("BASE_URL", "http://localhost:3000")
    API_URL: str = os.environ.get("API_URL", "http://localhost:8000")

    # Email
    SMTP_HOST: str = os.environ.get("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT: int = int(os.environ.get("SMTP_PORT", "587"))
    SMTP_USER: str = os.environ.get("SMTP_USER", "")
    SMTP_PASSWORD: str = os.environ.get("SMTP_PASSWORD", "")
    EMAIL_FROM: str = os.environ.get("EMAIL_FROM", "MoneyTree <noreply@example.com>")

    # Telegram
    TELEGRAM_BOT_TOKEN: str = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    TELEGRAM_ADMIN_CHAT_ID: str = os.environ.get("TELEGRAM_ADMIN_CHAT_ID", "")

    # Twilio WhatsApp
    TWILIO_ACCOUNT_SID: str = os.environ.get("TWILIO_ACCOUNT_SID", "")
    TWILIO_AUTH_TOKEN: str = os.environ.get("TWILIO_AUTH_TOKEN", "")
    TWILIO_WHATSAPP_FROM: str = os.environ.get(
        "TWILIO_WHATSAPP_FROM",
        "whatsapp:+14155238886"
    )

    # Stripe
    STRIPE_SECRET_KEY: str = os.environ.get("STRIPE_SECRET_KEY", "")

    # YouTube
    YOUTUBE_API_KEY: str = os.environ.get("YOUTUBE_API_KEY", "")

    # Points
    POINTS_PER_REFERRAL: int = int(os.environ.get("POINTS_PER_REFERRAL", "100"))
    POINTS_PER_BROWSE: int = int(os.environ.get("POINTS_PER_BROWSE", "5"))
    POINTS_PER_LIKE: int = int(os.environ.get("POINTS_PER_LIKE", "10"))
    POINTS_PER_SUBSCRIBE: int = int(os.environ.get("POINTS_PER_SUBSCRIBE", "20"))
    POINTS_CASHOUT_MINIMUM: int = int(
        os.environ.get("POINTS_CASHOUT_MINIMUM", "500")
    )

    # Revenue
    REVENUE_PER_REFERRAL: float = float(
        os.environ.get("REVENUE_PER_REFERRAL", "0.50")
    )
    REVENUE_CURRENCY: str = os.environ.get("REVENUE_CURRENCY", "USD")

    # Browse Settings
    DEFAULT_BROWSE_TOTAL: int = int(
        os.environ.get("DEFAULT_BROWSE_TOTAL", "25")
    )
    ADMIN_CHANNEL_SLOTS: int = int(
        os.environ.get("ADMIN_CHANNEL_SLOTS", "10")
    )
    MAX_DAILY_ACTIONS: int = int(
        os.environ.get("MAX_DAILY_ACTIONS", "35")
    )
    MIN_DELAY_SECONDS: int = int(
        os.environ.get("MIN_DELAY_SECONDS", "15")
    )
    MAX_DELAY_SECONDS: int = int(
        os.environ.get("MAX_DELAY_SECONDS", "50")
    )

    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()
