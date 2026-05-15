from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from app.config import settings
from app.api.v1.api import api_router
from app.core.database import Base, engine

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

# --- CORS Security Engine Configuration ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits direct file:// pathways and remote origins
    allow_credentials=False,  # Required by standard specifications when origins is a wildcard '*'
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# --- Backend Application Router Links ---
# Mounted BEFORE any catch-all static folders to ensure API paths take precedence
app.include_router(api_router, prefix="/api/v1")

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "project": settings.PROJECT_NAME}


# --- Static Frontend Serving Infrastructure ---
frontend_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")

if os.path.exists(frontend_dir):
    # Specific asset files take highest layout priority
    @app.get("/")
    def read_index():
        return FileResponse(os.path.join(frontend_dir, "index.html"))

    # Mount static asset subdirectory folder routing (safely isolated under /assets)
    # This prevents frontend routing rules from accidentally capturing /api calls
    app.mount("/static", StaticFiles(directory=frontend_dir), name="static")
