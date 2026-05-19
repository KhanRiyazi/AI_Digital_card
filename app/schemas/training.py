from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime

class TrainingConfig(BaseModel):
    model_type: str = Field(default="xgboost", description="Model type (random_forest/gradient_boosting/xgboost)")
    test_size: float = Field(default=0.2, ge=0.1, le=0.4)
    random_state: int = Field(default=42)
    use_grid_search: bool = Field(default=False)
    n_iterations: int = Field(default=100, ge=10, le=500)

class TrainingResponse(BaseModel):
    status: str
    message: str
    config: TrainingConfig
    training_id: Optional[str] = None

class ModelMetrics(BaseModel):
    r2_score: float
    rmse: float
    mae: float
    training_date: datetime
    samples_trained: int
    best_model: Optional[str] = None
    feature_importance: Optional[Dict[str, float]] = None