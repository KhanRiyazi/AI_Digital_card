import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

class MLService:
    def __init__(self):
        self.model = None
    
    def train_model(self, data: pd.DataFrame, target_col: str):
        """Train ML model on provided data"""
        features = ['attendance_rate', 'average_exam_score', 'parent_engagement', 'student_teacher_ratio']
        X = data[features]
        y = data[target_col]
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.model.fit(X_train, y_train)
        
        predictions = self.model.predict(X_test)
        mae = mean_absolute_error(y_test, predictions)
        r2 = r2_score(y_test, predictions)
        
        return {
            "mae": float(mae),
            "r2_score": float(r2),
            "feature_importance": dict(zip(features, self.model.feature_importances_.tolist()))
        }
    
    def predict(self, features: np.ndarray) -> float:
        """Make prediction using trained model"""
        if self.model is None:
            raise ValueError("Model not trained yet")
        return float(self.model.predict(features)[0])