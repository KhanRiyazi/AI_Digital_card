from fastapi import APIRouter
from typing import Dict, Any, List
from datetime import datetime, timedelta
import logging
from app.api.v1.endpoints.users import students_db

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/dashboard")
async def get_dashboard_stats():
    """Get dashboard statistics"""
    total_students = len(students_db)
    
    # Calculate statistics from student data
    cs_interest = 0
    total_score = 0
    score_count = 0
    risk_distribution = {"low": 0, "moderate": 0, "high": 0, "critical": 0}
    
    for student in students_db.values():
        interest = student.get('interest', '').lower()
        if any(keyword in interest for keyword in ['computer', 'ai', 'cs', 'data', 'programming']):
            cs_interest += 1
        
        # Calculate performance score
        attendance = student.get('attendance', 85)
        exam_score = student.get('examScore', 72)
        performance = (attendance * 0.3 + exam_score * 0.7) / 100
        
        if performance >= 0.75:
            risk_distribution["low"] += 1
        elif performance >= 0.6:
            risk_distribution["moderate"] += 1
        elif performance >= 0.4:
            risk_distribution["high"] += 1
        else:
            risk_distribution["critical"] += 1
        
        prev_result = student.get('prevResult')
        if prev_result and isinstance(prev_result, str):
            try:
                score = float(prev_result)
                total_score += score
                score_count += 1
            except ValueError:
                pass
    
    average_score = round(total_score / score_count, 1) if score_count > 0 else 0
    
    return {
        "total_students": total_students,
        "active_sessions": 1,  # Simplified
        "average_performance": round(average_score, 1),
        "risk_distribution": risk_distribution,
        "cs_interest": cs_interest,
        "recent_predictions": 0,
        "model_accuracy": 85.3,
        "last_updated": datetime.now().isoformat()
    }

@router.get("/trends")
async def get_performance_trends():
    """Get performance trends over time"""
    dates = [(datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d") for i in range(30, 0, -1)]
    
    # Generate mock trend data
    import numpy as np
    base_scores = [65 + i * 0.2 + np.random.normal(0, 2) for i in range(len(dates))]
    risk_counts = [10 + int(i / 3) + np.random.randint(-2, 3) for i in range(len(dates))]
    
    return {
        "dates": dates,
        "average_scores": [round(s, 1) for s in base_scores],
        "risk_counts": risk_counts
    }

@router.get("/export")
async def export_analytics(format: str = "json"):
    """Export analytics data"""
    data = {
        "export_date": datetime.now().isoformat(),
        "stats": await get_dashboard_stats(),
        "students": list(students_db.values()),
        "trends": await get_performance_trends()
    }
    return data

@router.get("/class-distribution")
async def get_class_distribution():
    """Get distribution of students by class"""
    class_counts = {}
    for student in students_db.values():
        class_name = student.get('class_', 'Unknown')
        class_counts[class_name] = class_counts.get(class_name, 0) + 1
    
    return {
        "labels": list(class_counts.keys()),
        "values": list(class_counts.values())
    }

@router.get("/performance-metrics")
async def get_performance_metrics():
    """Get detailed performance metrics"""
    metrics = {
        "attendance": [],
        "exam_scores": [],
        "parent_engagement": []
    }
    
    for student in students_db.values():
        metrics["attendance"].append(student.get('attendance', 85))
        metrics["exam_scores"].append(student.get('examScore', 72))
        metrics["parent_engagement"].append(student.get('parentEngagement', 6.5))
    
    def get_stats(arr):
        if not arr:
            return {"avg": 0, "min": 0, "max": 0}
        return {
            "avg": round(sum(arr) / len(arr), 1),
            "min": min(arr),
            "max": max(arr)
        }
    
    return {
        "attendance": get_stats(metrics["attendance"]),
        "exam_scores": get_stats(metrics["exam_scores"]),
        "parent_engagement": get_stats(metrics["parent_engagement"])
    }