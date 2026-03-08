from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from App.config.db_connection import get_db
from sqlalchemy.orm import Session
from App.Model.user import User
from App.config.services import hash_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login-user")  # endpoint that returns token

def get_current_user(token: str, db: Session):
    hashed = hash_token(token)
    user = db.query(User).filter(User.api_tokens == hashed).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    return user