from fastapi import Depends, HTTPException, status
from App.config.db_connection import get_db
from sqlalchemy.orm import Session
from App.Model.user import User
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import jwt

load_dotenv()


from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from App.config.db_connection import get_db
from App.Model.user import User
from sqlalchemy.orm import Session


security = HTTPBearer(auto_error=False)  


SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"

def verify_jwt_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # Check expiration
        exp = payload.get("exp")
        if exp and datetime.utcnow().timestamp() > exp:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expired"
            )
        return payload
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication is required"
        )
    token = credentials.credentials 
    payload = verify_jwt_token(token)  

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    user = db.query(User).filter(User.id == payload.get("user_id")).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    return user


def create_jwt_token(user_id: int, email: str, token_expire_hours=24):
    expiration = datetime.utcnow() + timedelta(hours=token_expire_hours)
    payload = {
        "user_id": str(user_id),
        "email": email,
        "exp": expiration
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token, expiration