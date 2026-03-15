from fastapi.responses import JSONResponse
from App.Model.user import User 
from App.schema.user_schema import UserSchema, CreateUser, LoginUser , Message, ListUser
from sqlalchemy.orm import Session
from App.config.db_connection import get_db
from App.service.login_services import create_user_service, login_user as login_user_service , list_users , signout_user
from fastapi import Depends
from fastapi import APIRouter, Header

router =APIRouter(tags=["User Management"])

@router.post("/create-users",response_model=UserSchema)
async def create_user(user:CreateUser,db:Session = Depends(get_db)):
    return create_user_service(user,db)

@router.post("/login-user",response_model=Message)
async def login_user(user:LoginUser,db:Session = Depends(get_db)):
    return login_user_service(user,db)

@router.get("/list-all-users",response_model=ListUser)
async def list_all_users(db: Session = Depends(get_db)):
    return list_users(db)

@router.post("/logout")
def logout(authorization: str = Header(...), db: Session = Depends(get_db)):
    token = authorization
    return signout_user(token, db)