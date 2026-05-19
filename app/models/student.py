from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from app.core.database import Base

class Student(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    roll_no = Column(String, unique=True, index=True, nullable=False)
    class_name = Column(String, nullable=False)
    email = Column(String, index=True, nullable=False)
    mobile = Column(String)
    aadhaar = Column(String)
    prev_result = Column(Float)
    interest = Column(Text)
    goal = Column(Text)
    social = Column(Text)
    dob = Column(String)
    attendance = Column(Float, default=85.0)
    exam_score = Column(Float, default=72.0)
    parent_engagement = Column(Float, default=6.5)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())