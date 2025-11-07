from fastapi import HTTPException
from fastapi.responses import JSONResponse
from App.Model.user import User 
from App.schema.user_schema import UserSchema, CreateUser, LoginUser , Message
from sqlalchemy.orm import Session
from App.config.db_connection import get_db
from App.config.services import create_user_service, login_user as login_user_service
from fastapi import Depends
from fastapi import APIRouter

router =APIRouter()

@router.post("/create-users",response_model=UserSchema)
async def create_user(user:CreateUser,db:Session = Depends(get_db)):
    return create_user_service(user,db)

@router.post("/login-user",response_model=Message)
async def login_user(user:LoginUser,db:Session = Depends(get_db)):
    return login_user_service(user,db)

