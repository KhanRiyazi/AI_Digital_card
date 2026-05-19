from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class StudentBase(BaseModel):
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

class StudentCreate(StudentBase):
    pass

class StudentResponse(StudentBase):
    id: str
    createdAt: datetime
    updatedAt: Optional[datetime] = None
    attendance: Optional[float] = 85.0
    examScore: Optional[float] = 72.0
    parentEngagement: Optional[float] = 6.5
    
    class Config:
        from_attributes = True