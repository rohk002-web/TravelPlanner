from App.Model.user import User 
from App.schema.user_schema import UserSchema, CreateUser, LoginUser , Message, ListUser , SignoutMessage
from sqlalchemy.orm import Session
from App.config.db_connection import get_db
from App.service.login_services import create_user_service, login_user as login_user_service , list_users
from fastapi import Depends, APIRouter
from App.service.authentication_service import get_current_user

router =APIRouter(tags=["User Management"])

@router.get("/list-all-users",response_model=ListUser)
async def list_all_users(db: Session = Depends(get_db)):
    return list_users(db)

@router.get("/log-out", response_model=SignoutMessage)
async def sign_out(current_user: User = Depends(get_current_user)):
    return {"message": "Successfully signed out."}

@router.post("/create-users",response_model=UserSchema)
async def create_user(user:CreateUser,db:Session = Depends(get_db)):
    return create_user_service(user,db)

@router.post("/login-user",response_model=Message)
async def login_user(user:LoginUser,db:Session = Depends(get_db)):
    return login_user_service(user,db)