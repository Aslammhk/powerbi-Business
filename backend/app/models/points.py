from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime
import uuid

class PointsTransaction(Base):
    __tablename__ = "points_transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    points = Column(Integer)
    transaction_type = Column(String)
    reason = Column(String)
    reference_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class PointsBalance(Base):
    __tablename__ = "points_balances"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True)
    total_earned = Column(Integer, default=0)
    total_spent = Column(Integer, default=0)
    current_balance = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow)
