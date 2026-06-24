from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime
import uuid

class RevenueTransaction(Base):
    __tablename__ = "revenue_transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    amount = Column(Float)
    currency = Column(String, default="USD")
    transaction_type = Column(String)
    status = Column(String, default="pending")
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class RevenueBalance(Base):
    __tablename__ = "revenue_balances"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True)
    total_earned = Column(Float, default=0.0)
    total_paid = Column(Float, default=0.0)
    pending_balance = Column(Float, default=0.0)
    updated_at = Column(DateTime, default=datetime.utcnow)
