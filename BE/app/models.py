from .database import Base
from sqlalchemy import TIMESTAMP, Column, Integer, String, ForeignKey,Boolean, BigInteger, BINARY, FLOAT
from sqlalchemy.sql.expression import text

class DeviceInfo(Base):
    __tablename__ = "deviceinfo"
    id = Column(BigInteger, primary_key=True, nullable=False)
    longtitude = Column(FLOAT, nullable=False)
    latitude = Column(FLOAT, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, 
        server_default=text("now()"))
    
    