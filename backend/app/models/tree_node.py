from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime
import uuid

class TreeNode(Base):
    __tablename__ = "tree_nodes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    parent_node_id = Column(UUID(as_uuid=True), ForeignKey("tree_nodes.id"), nullable=True)
    level = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="tree_nodes")
    parent = relationship("TreeNode", remote_side=[id], back_populates="children")
    children = relationship("TreeNode", back_populates="parent")
