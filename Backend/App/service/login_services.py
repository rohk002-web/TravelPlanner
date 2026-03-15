from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from App.Model.user import User
import uuid
from fastapi import HTTPException, status
import secrets
import hashlib

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")  # Ensure argon2_cffi installed
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

def hash_token(token: str):
    return hashlib.sha256(token.encode()).hexdigest()

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

    # Generate token and hash it
    raw_token = secrets.token_hex(32)  # 64-character token
    hashed_token = hash_token(raw_token)

    # Save hashed token in DB
    user.api_tokens = hashed_token
    db.commit()

    # Return raw token to client
    expires_at = datetime.utcnow() + timedelta(hours=token_expire_hours)
    return {"message": "Login successful", "token": raw_token, "expires_at": expires_at}

def signout_user(token: str, db: Session):
    # hash the incoming token
    hashed_token = hash_token(token)

    # find user with this token
    user = db.query(User).filter(User.api_tokens == hashed_token).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

    # remove token from DB
    user.api_tokens = None
    db.commit()

    return {
        "message": "Successfully logged out"
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