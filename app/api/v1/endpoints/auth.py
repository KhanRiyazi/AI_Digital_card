from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional
import jwt
import logging

from app.config import settings

router = APIRouter()
security = HTTPBearer()
logger = logging.getLogger(__name__)

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
    email: str
    role: str

class TokenData(BaseModel):
    email: str
    exp: datetime
    role: str

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Authenticate principal user"""
    logger.info(f"Login attempt for: {request.email}")
    
    if request.email == settings.ADMIN_EMAIL and request.password == settings.ADMIN_PASSWORD_HASH:
        # Create JWT token
        expires = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        token_data = {
            "sub": request.email,
            "exp": expires,
            "role": "principal"
        }
        token = jwt.encode(token_data, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        
        return LoginResponse(
            access_token=token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            email=request.email,
            role="principal"
        )
    
    logger.warning(f"Failed login attempt for: {request.email}")
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials"
    )

@router.post("/logout")
async def logout():
    """Logout user"""
    return {"message": "Logged out successfully"}

@router.get("/verify")
async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token"""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email = payload.get("sub")
        role = payload.get("role")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"valid": True, "email": email, "role": role}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# from datetime import timedelta
# from fastapi import APIRouter, Depends, HTTPException, status
# from fastapi.security import OAuth2PasswordRequestForm
# from sqlalchemy.orm import Session
# from app.core.database import get_db
# from app.core.security import verify_password, create_access_token
# from app.services import user_service
# from app.schemas.user import Token

# router = APIRouter()

# @router.post("/login", response_model=Token)
# def login(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
#     user = user_service.get_user_by_email(db, email=form_data.username)
#     if not user or not verify_password(form_data.password, user.hashed_password):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect email or password",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
#     access_token = create_access_token(subject=user.email)
#     return {"access_token": access_token, "token_type": "bearer"}
