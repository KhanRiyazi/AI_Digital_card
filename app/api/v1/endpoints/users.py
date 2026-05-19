from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

class StudentCreate(BaseModel):
    name: str
    rollNo: str
    class_: str
    email: EmailStr
    mobile: str
    aadhaar: Optional[str] = None
    prevResult: Optional[str] = None
    interest: Optional[str] = None
    goal: Optional[str] = None
    social: Optional[str] = None
    dob: Optional[str] = None

class StudentResponse(StudentCreate):
    id: str
    createdAt: str
    updatedAt: Optional[str] = None
    attendance: Optional[int] = 85
    examScore: Optional[int] = 72
    parentEngagement: Optional[float] = 6.5

# In-memory storage (replace with database in production)
students_db = {}

# Sample data
sample_students = [
    {
        "id": "1001",
        "name": "Kiara Advani",
        "rollNo": "2024CS101",
        "class_": "12th Grade",
        "email": "kiara@academy.edu",
        "mobile": "+91 9876543210",
        "aadhaar": "XXXX-4321",
        "prevResult": "96.5",
        "interest": "Artificial Intelligence, ML",
        "goal": "MIT Research",
        "social": "https://linkedin.com/in/kiara",
        "dob": "2006-03-15",
        "createdAt": datetime.now().isoformat(),
        "attendance": 96,
        "examScore": 89,
        "parentEngagement": 8.5
    },
    {
        "id": "1002",
        "name": "Rahul Verma",
        "rollNo": "2024CS102",
        "class_": "12th Grade",
        "email": "rahul@academy.edu",
        "mobile": "9988776655",
        "aadhaar": "XXXX-5678",
        "prevResult": "94.2",
        "interest": "Cybersecurity",
        "goal": "Stanford CS",
        "social": "https://github.com/rahulv",
        "dob": "2006-07-22",
        "createdAt": datetime.now().isoformat(),
        "attendance": 72,
        "examScore": 58,
        "parentEngagement": 4.2
    },
    {
        "id": "1003",
        "name": "Priya Patel",
        "rollNo": "2024CS103",
        "class_": "11th Grade",
        "email": "priya@academy.edu",
        "mobile": "9876543210",
        "aadhaar": "XXXX-7890",
        "prevResult": "88.5",
        "interest": "Data Science",
        "goal": "IIT Bombay",
        "createdAt": datetime.now().isoformat(),
        "attendance": 88,
        "examScore": 76,
        "parentEngagement": 7.0
    }
]

for student in sample_students:
    students_db[student["id"]] = student

@router.get("/", response_model=List[StudentResponse])
async def get_all_students():
    """Get all students"""
    return list(students_db.values())

@router.get("/{student_id}", response_model=StudentResponse)
async def get_student(student_id: str):
    """Get student by ID"""
    if student_id not in students_db:
        raise HTTPException(status_code=404, detail="Student not found")
    return students_db[student_id]

@router.post("/", response_model=StudentResponse)
async def create_student(student: StudentCreate):
    """Create a new student"""
    student_id = str(int(datetime.now().timestamp() * 1000))
    new_student = {
        "id": student_id,
        "createdAt": datetime.now().isoformat(),
        "attendance": 85,
        "examScore": 72,
        "parentEngagement": 6.5,
        **student.dict()
    }
    students_db[student_id] = new_student
    logger.info(f"Student created: {student.name} (ID: {student_id})")
    return new_student

@router.put("/{student_id}", response_model=StudentResponse)
async def update_student(student_id: str, student: StudentCreate):
    """Update an existing student"""
    if student_id not in students_db:
        raise HTTPException(status_code=404, detail="Student not found")
    
    updated_student = {
        **students_db[student_id],
        **student.dict(),
        "updatedAt": datetime.now().isoformat()
    }
    students_db[student_id] = updated_student
    logger.info(f"Student updated: {student.name} (ID: {student_id})")
    return updated_student

@router.delete("/{student_id}")
async def delete_student(student_id: str):
    """Delete a student"""
    if student_id not in students_db:
        raise HTTPException(status_code=404, detail="Student not found")
    del students_db[student_id]
    logger.info(f"Student deleted: {student_id}")
    return {"message": "Student deleted successfully"}


# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session
# from jose import jwt, JWTError
# from fastapi.security import OAuth2PasswordBearer
# from app.core.database import get_db
# from app.core.security import settings
# from app.services import user_service
# from app.schemas.user import User, UserCreate, TokenData

# router = APIRouter()
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

# def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )
#     try:
#         payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
#         email: str = payload.get("sub")
#         if email is None:
#             raise credentials_exception
#         token_data = TokenData(email=email)
#     except JWTError:
#         raise credentials_exception
#     user = user_service.get_user_by_email(db, email=token_data.email)
#     if user is None:
#         raise credentials_exception
#     return user

# @router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
# def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
#     db_user = user_service.get_user_by_email(db, email=user_in.email)
#     if db_user:
#         raise HTTPException(status_code=400, detail="Email already registered")
#     return user_service.create_user(db=db, user_in=user_in)

# @router.get("/me", response_model=User)
# def read_user_me(current_user: User = Depends(get_current_user)):
#     return current_user
