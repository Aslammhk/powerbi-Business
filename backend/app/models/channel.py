from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime
import uuid

class Channel(Base):
    __tablename__ = "channels"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    youtube_url = Column(String, unique=True, nullable=False)
    channel_name = Column(String, nullable=False)
    platform = Column(String, default="youtube")
    is_admin_default = Column(Boolean, default=False)
    is_locked = Column(Boolean, default=False)
    url_signature = Column(String, nullable=True)
    lock_reason = Column(String, nullable=True)
    browse_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    subscriber_count = Column(Integer, default=0)
    view_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="channels")
    browse_logs = relationship("BrowseLog", back_populates="channel")
