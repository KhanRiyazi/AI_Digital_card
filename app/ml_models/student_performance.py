import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.svm import SVR

class StudentPerformanceModel:
    def __init__(self, model_type='random_forest'):
        self.model_type = model_type
        self.model = self._create_model()
    
    def _create_model(self):
        if self.model_type == 'random_forest':
            return RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
        elif self.model_type == 'linear_regression':
            return LinearRegression()
        elif self.model_type == 'svr':
            return SVR(kernel='rbf')
        else:
            raise ValueError(f"Unknown model type: {self.model_type}")
    
    def train(self, X: np.ndarray, y: np.ndarray):
        """Train the model"""
        self.model.fit(X, y)
    
    def predict(self, X: np.ndarray) -> np.ndarray:
        """Make predictions"""
        return self.model.predict(X)
    
    def get_feature_importance(self, feature_names: list) -> dict:
        """Get feature importance for tree-based models"""
        if hasattr(self.model, 'feature_importances_'):
            return dict(zip(feature_names, self.model.feature_importances_.tolist()))
        return {}