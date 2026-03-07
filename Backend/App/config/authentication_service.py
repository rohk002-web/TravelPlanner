from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from App.config.db_connection import get_db
from sqlalchemy.orm import Session
from App.Model.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login-user")  # endpoint that returns token

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Simple JWT or API token check.
    Replace with real token decoding and DB lookup.
    """
    # Example: your login_user_service could return a token after login
    user = db.query(User).filter(User.api_token == token).first()  # if you store tokens in DB
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user