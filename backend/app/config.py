from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:password@db:5432/moneytree"
    REDIS_URL: str = "redis://redis:6379/0"
    SECRET_KEY: str = "change-this-secret-key-minimum-32-chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080
    ADMIN_EMAIL: str = "admin@example.com"
    ADMIN_PASSWORD: str = "admin123"
    APP_NAME: str = "MoneyTree Network"
    BASE_URL: str = "http://localhost:3000"
    API_URL: str = "http://localhost:8000"
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = "MoneyTree <noreply@example.com>"
    TELEGRAM_BOT_TOKEN: str = ""
    TELEGRAM_ADMIN_CHAT_ID: str = ""
    FIREBASE_PROJECT_ID: str = ""
    FIREBASE_PRIVATE_KEY: str = ""
    FIREBASE_CLIENT_EMAIL: str = ""
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_WHATSAPP_FROM: str = "whatsapp:+14155238886"
    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    YOUTUBE_API_KEY: str = ""
    POINTS_PER_REFERRAL: int = 100
    POINTS_PER_BROWSE: int = 5
    POINTS_PER_LIKE: int = 10
    POINTS_PER_SUBSCRIBE: int = 20
    POINTS_CASHOUT_MINIMUM: int = 500
    REVENUE_PER_REFERRAL: float = 0.50
    REVENUE_CURRENCY: str = "USD"
    DEFAULT_BROWSE_TOTAL: int = 25
    ADMIN_CHANNEL_SLOTS: int = 10
    MAX_DAILY_ACTIONS: int = 35
    MIN_DELAY_SECONDS: int = 15
    MAX_DELAY_SECONDS: int = 50

    class Config:
        env_file = ".env"

settings = Settings()
