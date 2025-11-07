from pydantic import BaseModel
from typing import Optional
from App.Model.user import User
from uuid import UUID

class UserSchema(BaseModel):
    message:str
    id: UUID
    email_id: str
    
class CreateUser(BaseModel):
    email_id: str
    password: str


class LoginUser(BaseModel):
    email_id: str
    password: str

class ErrorResponse(BaseModel):
    message: str

class Message(BaseModel):
    message:str

    class Config:
        orm_mode = True