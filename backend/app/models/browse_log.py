from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime
import uuid

class BrowseLog(Base):
    __tablename__ = "browse_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    channel_id = Column(UUID(as_uuid=True), ForeignKey("channels.id"))
    action = Column(String)
    status = Column(String)
    message = Column(String, nullable=True)
    executed_at = Column(DateTime, default=datetime.utcnow)

    channel = relationship("Channel", back_populates="browse_logs")
