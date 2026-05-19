from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    prediction_score = Column(Float, nullable=False)
    risk_category = Column(String)
    recommendation = Column(String)
    confidence_score = Column(Float)
    key_factors = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())