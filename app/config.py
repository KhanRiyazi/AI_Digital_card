from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "FastAPI"
    SECRET_KEY: str = "CHANGE_ME"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DATABASE_URL: str = "sqlite:///./test.db"
    
    # Add allowed origins as a parsed list
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",    # React default port
        "http://localhost:5173",    # Vite / Vue / Svelte default port
        "http://localhost:8000",    # Self / Local FastAPI port
        "http://127.0.0.1:8000",
    ]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
