from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import numpy as np
import logging
from app.core.ml_pipeline import ml_pipeline

router = APIRouter()
logger = logging.getLogger(__name__)

class PredictionRequest(BaseModel):
    attendance_rate: float = Field(..., ge=0, le=100, description="Attendance percentage")
    average_exam_score: float = Field(..., ge=0, le=100, description="Average exam score")
    student_teacher_ratio: float = Field(..., ge=10, le=50, description="Student to teacher ratio")
    parent_engagement: float = Field(..., ge=1, le=10, description="Parent engagement level (1-10)")
    school_level: str = Field(..., pattern="^(high|middle)$", description="School level")

class PredictionResponse(BaseModel):
    prediction: float
    risk_category: str
    recommendation: str
    confidence_score: float
    key_factors: List[str]

@router.post("/", response_model=PredictionResponse)
async def predict_performance(request: PredictionRequest):
    """
    Predict student performance using ML model.
    Returns a score between 0 and 1 with risk assessment.
    """
    logger.info(f"Prediction request for school level: {request.school_level}")
    
    # Calculate base score using weighted formula
    # This simulates ML model (in production, use actual trained model)
    if ml_pipeline.is_trained:
        # Use trained ML model
        features = np.array([[
            request.attendance_rate,
            request.average_exam_score,
            request.student_teacher_ratio,
            request.parent_engagement
        ]])
        prediction = ml_pipeline.predict(features)[0]
    else:
        # Fallback to rule-based prediction
        prediction = calculate_rule_based_score(request)
    
    # Adjust for school level
    if request.school_level == "high":
        prediction = prediction * 0.95  # Higher standards for high school
    
    # Ensure prediction is between 0 and 1
    prediction = max(0, min(1, prediction))
    
    # Determine risk category and recommendation
    risk_category, recommendation = get_risk_assessment(prediction)
    
    # Identify key factors affecting prediction
    key_factors = identify_key_factors(request)
    
    # Calculate confidence score
    confidence_score = calculate_confidence(request, prediction)
    
    return PredictionResponse(
        prediction=round(prediction, 3),
        risk_category=risk_category,
        recommendation=recommendation,
        confidence_score=round(confidence_score, 3),
        key_factors=key_factors
    )

def calculate_rule_based_score(request: PredictionRequest) -> float:
    """Calculate score using weighted formula"""
    score = (
        request.attendance_rate * 0.30 +
        request.average_exam_score * 0.40 +
        (request.parent_engagement * 10) * 0.20 +
        (100 - request.student_teacher_ratio * 2) * 0.10
    ) / 100
    return score

def get_risk_assessment(score: float) -> tuple:
    """Determine risk category and recommendation based on score"""
    if score >= 0.85:
        return "Low Risk", "Student is performing exceptionally well. Encourage advanced coursework and leadership roles."
    elif score >= 0.75:
        return "Low Risk", "Student is performing excellently. Consider enrichment activities and honors classes."
    elif score >= 0.65:
        return "Moderate Risk", "Student is performing well. Monitor progress and provide additional support if needed."
    elif score >= 0.55:
        return "Moderate Risk", "Student has potential for improvement. Schedule academic counseling session."
    elif score >= 0.45:
        return "High Risk", "Student needs intervention. Implement tutoring and parent-teacher meeting."
    elif score >= 0.35:
        return "High Risk", "Student is struggling. Immediate academic support plan required."
    else:
        return "Critical Risk", "URGENT: Comprehensive intervention needed. Contact parents and develop intensive support plan."

def identify_key_factors(request: PredictionRequest) -> List[str]:
    """Identify key factors affecting the prediction"""
    factors = []
    
    if request.attendance_rate < 75:
        factors.append("Low attendance rate")
    elif request.attendance_rate > 95:
        factors.append("Excellent attendance")
    
    if request.average_exam_score < 60:
        factors.append("Below average exam scores")
    elif request.average_exam_score > 85:
        factors.append("High exam performance")
    
    if request.parent_engagement < 4:
        factors.append("Low parent engagement")
    elif request.parent_engagement > 8:
        factors.append("Strong parent engagement")
    
    if request.student_teacher_ratio > 35:
        factors.append("High student-teacher ratio")
    elif request.student_teacher_ratio < 20:
        factors.append("Favorable student-teacher ratio")
    
    if request.school_level == "high":
        factors.append("High school level rigor")
    
    if not factors:
        factors.append("All metrics within normal range")
    
    return factors[:3]  # Return top 3 factors

def calculate_confidence(request: PredictionRequest, prediction: float) -> float:
    """Calculate confidence score based on data completeness and consistency"""
    confidence = 0.85  # Base confidence
    
    # Adjust based on data quality
    if 0.3 < prediction < 0.7:
        confidence += 0.05  # Mid-range predictions are more confident
    
    if request.attendance_rate > 0 and request.average_exam_score > 0:
        confidence += 0.05
    
    if 4 <= request.parent_engagement <= 8:
        confidence += 0.03
    
    return min(0.98, confidence)

@router.post("/batch")
async def batch_predict(requests: List[PredictionRequest]):
    """Batch prediction for multiple students"""
    results = []
    for req in requests:
        result = await predict_performance(req)
        results.append(result.dict())
    return {"predictions": results, "count": len(results)}