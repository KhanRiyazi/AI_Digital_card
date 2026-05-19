import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os
import logging

logger = logging.getLogger(__name__)

class MLPipeline:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.is_trained = False
        self.feature_names = ['attendance_rate', 'average_exam_score', 'student_teacher_ratio', 'parent_engagement']
    
    def preprocess(self, X: np.ndarray) -> np.ndarray:
        """Preprocess input features"""
        X = np.array(X).reshape(-1, len(self.feature_names))
        if self.is_trained:
            return self.scaler.transform(X)
        return X
    
    def train(self, X: np.ndarray, y: np.ndarray):
        """Train the ML model"""
        logger.info("Training ML model...")
        X_scaled = self.scaler.fit_transform(X)
        
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        )
        self.model.fit(X_scaled, y)
        self.is_trained = True
        logger.info("ML model training completed")
        
        # Log feature importance
        importance = dict(zip(self.feature_names, self.model.feature_importances_))
        logger.info(f"Feature importance: {importance}")
    
    def predict(self, X: np.ndarray) -> np.ndarray:
        """Make predictions using trained model"""
        if not self.is_trained or self.model is None:
            raise ValueError("Model not trained yet")
        
        X_scaled = self.preprocess(X)
        predictions = self.model.predict(X_scaled)
        return np.clip(predictions, 0, 1)
    
    def save_model(self, path: str):
        """Save model to disk"""
        os.makedirs(os.path.dirname(path), exist_ok=True)
        joblib.dump({
            'model': self.model,
            'scaler': self.scaler,
            'feature_names': self.feature_names,
            'is_trained': self.is_trained
        }, path)
        logger.info(f"Model saved to {path}")
    
    def load_model(self, path: str):
        """Load model from disk"""
        if os.path.exists(path):
            data = joblib.load(path)
            self.model = data['model']
            self.scaler = data['scaler']
            self.feature_names = data.get('feature_names', self.feature_names)
            self.is_trained = data.get('is_trained', True)
            logger.info(f"Model loaded from {path}")
            return True
        logger.warning(f"Model file not found: {path}")
        return False

# Global instance
ml_pipeline = MLPipeline()