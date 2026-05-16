from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from pydantic import BaseModel, Field
from datetime import datetime
import logging
from typing import List, Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import your existing modules (if they exist)
try:
    from app.config import settings
    from app.api.v1.api import api_router
    from app.core.database import Base, engine
except ImportError:
    # Fallback for standalone testing
    class settings:
        PROJECT_NAME = "Smart Digital ID API"
    api_router = None
    Base = None
    engine = None
    logger.warning("Running in standalone mode without app modules")

# Initialize database tables if available
if Base and engine:
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized successfully")
    except Exception as e:
        logger.warning(f"Database initialization skipped: {e}")

# Create FastAPI app
app = FastAPI(title=settings.PROJECT_NAME if hasattr(settings, 'PROJECT_NAME') else "Smart Digital ID API")

# --- CORS Configuration ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# 📊 ML MODEL PREDICTION ENDPOINT
# ============================================

class SchoolPredictionRequest(BaseModel):
    attendance_rate: float = Field(..., ge=0, le=100, description="Student attendance percentage")
    average_exam_score: float = Field(..., ge=0, le=100, description="Previous exam average score")
    student_teacher_ratio: float = Field(..., gt=0, le=60, description="Number of students per teacher")
    parent_engagement: float = Field(..., ge=0, le=10, description="Parental engagement index")
    school_level: Optional[str] = Field("middle", description="School level: primary, middle, high")
    context_notes: Optional[str] = Field("", description="Additional context")
    
    class Config:
        json_schema_extra = {
            "example": {
                "attendance_rate": 86.5,
                "average_exam_score": 71.2,
                "student_teacher_ratio": 26.0,
                "parent_engagement": 6.3,
                "school_level": "middle"
            }
        }

class SchoolPredictionResponse(BaseModel):
    prediction: float
    confidence_score: float
    risk_category: str
    recommendation: str
    key_factors: List[str]
    timestamp: str
    model_version: str = "1.0.0"

# ML Model Logic
class SchoolMLModel:
    def __init__(self):
        self.model_weights = {
            "attendance": 0.35,
            "exam_score": 0.30,
            "parent_engagement": 0.20,
            "student_ratio": 0.15
        }
        logger.info("ML Model initialized")
    
    def predict(self, features: dict) -> dict:
        attendance = features.get("attendance_rate", 75)
        exam_score = features.get("average_exam_score", 65)
        parent_eng = features.get("parent_engagement", 5)
        student_ratio = features.get("student_teacher_ratio", 25)
        school_level = features.get("school_level", "middle")
        
        # Normalize features
        attendance_norm = attendance / 100.0
        exam_norm = exam_score / 100.0
        parent_norm = parent_eng / 10.0
        ratio_score = max(0, min(1, 1 - (student_ratio / 45.0)))
        
        # Calculate score
        raw_score = (
            self.model_weights["attendance"] * attendance_norm +
            self.model_weights["exam_score"] * exam_norm +
            self.model_weights["parent_engagement"] * parent_norm +
            self.model_weights["student_ratio"] * ratio_score
        )
        
        level_boost = {"primary": 0.05, "middle": 0.02, "high": 0.00}.get(school_level, 0.02)
        final_score = min(0.99, raw_score + level_boost)
        
        # Risk assessment
        if final_score >= 0.75:
            risk_category = "Low Risk"
            recommendation = "✅ Excellent performance! Continue current strategies. Focus on enrichment programs."
            key_factors = ["high attendance", "strong exam results", "engaged parents"]
        elif final_score >= 0.55:
            risk_category = "Moderate Risk"
            recommendation = "📌 Stable but room for improvement. Focus on increasing parent engagement."
            key_factors = ["average attendance", "moderate scores", "needs community outreach"]
        elif final_score >= 0.35:
            risk_category = "High Risk"
            recommendation = "⚠️ Intervention needed. Prioritize attendance initiatives and tutoring programs."
            key_factors = ["low attendance", "below average scores", "limited parental involvement"]
        else:
            risk_category = "Critical Risk"
            recommendation = "🚨 Immediate intervention required. Schedule emergency parent meetings."
            key_factors = ["critical attendance", "very low scores", "no parent engagement"]
        
        # Specific recommendations
        if attendance < 75:
            recommendation += " Launch attendance incentive program."
        if exam_score < 60:
            recommendation += " Implement after-school tutoring."
        if parent_eng < 4:
            recommendation += " Start monthly parent-teacher workshops."
        
        confidence = 0.7 + (attendance_norm * 0.1) + (exam_norm * 0.1) + (parent_norm * 0.1)
        confidence = min(0.95, confidence)
        
        return {
            "prediction": round(final_score, 3),
            "confidence_score": round(confidence, 2),
            "risk_category": risk_category,
            "recommendation": recommendation,
            "key_factors": key_factors[:3]
        }

ml_model = SchoolMLModel()

@app.post("/predict", response_model=SchoolPredictionResponse, tags=["ML Prediction"])
async def predict_school_performance(request: SchoolPredictionRequest):
    """ML Prediction endpoint for school principals"""
    try:
        logger.info(f"Prediction request: attendance={request.attendance_rate}")
        result = ml_model.predict(request.dict())
        return SchoolPredictionResponse(
            prediction=result["prediction"],
            confidence_score=result["confidence_score"],
            risk_category=result["risk_category"],
            recommendation=result["recommendation"],
            key_factors=result["key_factors"],
            timestamp=datetime.utcnow().isoformat() + "Z",
            model_version="1.0.0"
        )
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/predict/health", tags=["ML Prediction"])
async def model_health():
    return {"status": "healthy", "model_version": "1.0.0", "ready": True}

# --- Backend API Router (if available) ---
if api_router:
    app.include_router(api_router, prefix="/api/v1")

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "project": getattr(settings, 'PROJECT_NAME', 'Smart Digital ID API')}

# ============================================
# 📱 FRONTEND SERVING
# ============================================

# Define frontend directory path
frontend_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")

# Serve the main frontend HTML file at root path
@app.get("/", tags=["Frontend"])
async def serve_frontend():
    """Serve the main frontend HTML file"""
    index_path = os.path.join(frontend_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    else:
        logger.error(f"Frontend not found at {index_path}")
        return {
            "error": "Frontend not found",
            "message": f"Please ensure frontend/index.html exists at: {frontend_dir}",
            "solution": "Create the frontend folder and add index.html file"
        }

# NEW: Serve any HTML file directly from frontend folder
@app.get("/{filename}.html", tags=["Frontend"])
async def serve_html_files(filename: str):
    """Serve any HTML file from the frontend directory (e.g., /principal-predictions.html)"""
    file_path = os.path.join(frontend_dir, f"{filename}.html")
    if os.path.exists(file_path):
        logger.info(f"Serving HTML file: {filename}.html")
        return FileResponse(file_path)
    else:
        raise HTTPException(status_code=404, detail=f"File {filename}.html not found")

# API info endpoint
@app.get("/api-info", tags=["API"])
async def api_info():
    """Get API information"""
    return {
        "message": "Welcome to Smart Digital ID API",
        "version": "1.0.0",
        "endpoints": {
            "predict": "/predict - POST - ML prediction for principals",
            "health": "/health - GET - Service health",
            "api_docs": "/docs - Interactive API documentation",
            "frontend": "/ - GET - Main user interface",
            "html_files": "/{filename}.html - GET - Any HTML file in frontend folder"
        },
        "ml_model_status": "operational"
    }

# Mount static files (CSS, JS, images, etc.)
if os.path.exists(frontend_dir):
    app.mount("/static", StaticFiles(directory=frontend_dir), name="static")
    logger.info(f"✅ Frontend static files mounted from {frontend_dir}")
    logger.info(f"📍 Main frontend available at: http://127.0.0.1:8000/")
    logger.info(f"📍 Principal ML Dashboard at: http://127.0.0.1:8000/principal-predictions.html")
else:
    logger.warning(f"❌ Frontend directory not found at {frontend_dir}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)