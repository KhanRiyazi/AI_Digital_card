from pydantic import BaseModel, Field
from typing import List, Optional

class PredictionRequest(BaseModel):
    attendance_rate: float = Field(..., ge=0, le=100)
    average_exam_score: float = Field(..., ge=0, le=100)
    student_teacher_ratio: float = Field(..., ge=10, le=50)
    parent_engagement: float = Field(..., ge=1, le=10)
    school_level: str = Field(..., pattern="^(high|middle)$")

class PredictionResponse(BaseModel):
    prediction: float
    risk_category: str
    recommendation: str
    confidence_score: float
    key_factors: List[str]