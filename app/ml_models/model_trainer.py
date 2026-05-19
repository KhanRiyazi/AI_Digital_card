import pandas as pd
import numpy as np
from sklearn.model_selection import cross_val_score, GridSearchCV
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import os

class ModelTrainer:
    def __init__(self, model):
        self.model = model
        self.training_history = []
    
    def train_with_cv(self, X: np.ndarray, y: np.ndarray, cv: int = 5):
        """Train model with cross-validation"""
        scores = cross_val_score(self.model, X, y, cv=cv, scoring='r2')
        self.model.fit(X, y)
        
        return {
            'cv_scores': scores.tolist(),
            'mean_score': float(scores.mean()),
            'std_score': float(scores.std())
        }
    
    def hyperparameter_tuning(self, X: np.ndarray, y: np.ndarray, param_grid: dict, cv: int = 3):
        """Perform hyperparameter tuning using GridSearchCV"""
        grid_search = GridSearchCV(
            self.model, param_grid, cv=cv, scoring='r2', n_jobs=-1
        )
        grid_search.fit(X, y)
        
        self.model = grid_search.best_estimator_
        
        return {
            'best_params': grid_search.best_params_,
            'best_score': float(grid_search.best_score_)
        }
    
    def evaluate(self, X_test: np.ndarray, y_test: np.ndarray) -> dict:
        """Evaluate model performance"""
        predictions = self.model.predict(X_test)
        
        return {
            'mse': float(mean_squared_error(y_test, predictions)),
            'rmse': float(np.sqrt(mean_squared_error(y_test, predictions))),
            'r2': float(r2_score(y_test, predictions))
        }
    
    def save_model(self, path: str):
        """Save trained model to disk"""
        os.makedirs(os.path.dirname(path), exist_ok=True)
        joblib.dump(self.model, path)
    
    def load_model(self, path: str):
        """Load trained model from disk"""
        if os.path.exists(path):
            self.model = joblib.load(path)