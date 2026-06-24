from sqlalchemy import Column, String, Boolean, DateTime, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    referral_code = Column(String, unique=True)
    referred_by_id = Column(UUID(as_uuid=True), nullable=True)
    total_referrals = Column(Integer, default=0)
    fcm_token = Column(String, nullable=True)
    whatsapp_number = Column(String, nullable=True)
    telegram_chat_id = Column(String, nullable=True)
    language = Column(String, default="en")
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

    channels = relationship("Channel", back_populates="owner")
    tree_nodes = relationship("TreeNode", back_populates="user")
    invites_sent = relationship("Invite", back_populates="sender")
