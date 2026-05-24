from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Text
from sqlalchemy import ForeignKey

from app.database.database import Base

class FaceEmbedding(Base):

    __tablename__ = "face_embeddings"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    embedding = Column(
        Text,
        nullable=False
    )