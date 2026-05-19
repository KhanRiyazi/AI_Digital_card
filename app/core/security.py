from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional
import jwt
from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

# from datetime import datetime, timedelta, timezone
# from typing import Any, Union
# import bcrypt
# from jose import jwt
# from app.config import settings

# def convert_to_timezone_aware(dt: datetime, tz: timezone = timezone.utc) -> datetime:
#     if dt.tzinfo is None:
#         return dt.replace(tzinfo=tz)
#     return dt.astimezone(tz)

# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     try:
#         # Convert plain text to bytes, then verify against the database hash bytes
#         return bcrypt.checkpw(
#             plain_password.encode("utf-8"), 
#             hashed_password.encode("utf-8")
#         )
#     except Exception:
#         return False

# def get_password_hash(password: str) -> str:
#     # Generate salt and hash the string natively using bcrypt 5.0+
#     salt = bcrypt.gensalt()
#     hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
#     return hashed.decode("utf-8")

# def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
#     if expires_delta:
#         expire = convert_to_timezone_aware(datetime.now()) + expires_delta
#     else:
#         expire = convert_to_timezone_aware(datetime.now()) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
#     to_encode = {"exp": expire, "sub": str(subject)}
#     return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
