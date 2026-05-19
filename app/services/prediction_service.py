import numpy as np
from typing import Dict, List
from app.core.ml_pipeline import ml_pipeline

class PredictionService:
    @staticmethod
    def predict(attendance: float, exam_score: float, engagement: float, student_teacher_ratio: float = 25) -> Dict:
        """Generate prediction for a student"""
        features = np.array([[attendance, exam_score, student_teacher_ratio, engagement]])
        
        if ml_pipeline.is_trained:
            prediction = ml_pipeline.predict(features)[0]
        else:
            # Fallback to rule-based prediction
            prediction = (attendance * 0.3 + exam_score * 0.4 + engagement * 10 * 0.3) / 100
        
        # Categorize risk
        if prediction >= 0.75:
            risk = "Low Risk"
            recommendation = "Student is performing excellently. Encourage advanced coursework."
        elif prediction >= 0.6:
            risk = "Moderate Risk"
            recommendation = "Student has room for improvement. Consider additional support."
        elif prediction >= 0.4:
            risk = "High Risk"
            recommendation = "Student needs academic support. Schedule parent-teacher meeting."
        else:
            risk = "Critical Risk"
            recommendation = "URGENT: Comprehensive intervention required."
        
        key_factors = []
        if attendance < 75:
            key_factors.append("Low attendance")
        if exam_score < 60:
            key_factors.append("Below average exam scores")
        if engagement < 5:
            key_factors.append("Low parent engagement")
        
        if not key_factors:
            key_factors = ["All metrics within acceptable range"]
        
        return {
            "prediction": float(prediction),
            "risk_category": risk,
            "recommendation": recommendation,
            "confidence_score": 0.85,
            "key_factors": key_factors[:3]
        }