from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from App.Model.user import User
import uuid
from fastapi import HTTPException, status
import jwt
import os
from dotenv import load_dotenv

load_dotenv()

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")  
def create_user_service(user_data, db: Session):
    existing_user = db.query(User).filter(User.email_id == user_data.email_id).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User with this email already exists"
        )

    hashed_password = pwd_context.hash(user_data.password)

    new_user = User(
        id=uuid.uuid4(),
        name=user_data.name,
        email_id=user_data.email_id,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "id": str(new_user.id),
        "name": new_user.name,
        "email_id": new_user.email_id
    }


# Password hashing context
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

SECRET_KEY = os.getenv("JWT_SECRET_KEY")

# Function to create JWT
def create_jwt_token(user_id: int, email: str, token_expire_hours=24):
    expiration = datetime.utcnow() + timedelta(hours=token_expire_hours)
    payload = {
        "user_id": str(user_id),
        "email": email,
        "exp": expiration
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token, expiration

# Login function
def login_user(user_data, db: Session, token_expire_hours=24):
    user = db.query(User).filter(User.email_id == user_data.email_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email"
        )
    
    if not pwd_context.verify(user_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid password"
        )

    # Generate JWT token
    token, expires_at = create_jwt_token(user.id, user.email_id, token_expire_hours)

    # Return JWT to client
    return {
        "message": "Login successful",
        "token": token,
        "expires_at": expires_at
    }


def list_users(db: Session):
    users = db.query(User).all()

    if not users:
        return {
            "message": "No users found",
            "data": []
        }

    return {
        "message": "Users fetched successfully",
        "data": users
    }