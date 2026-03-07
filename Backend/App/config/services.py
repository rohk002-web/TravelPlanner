from sqlalchemy.orm import Session
from passlib.context import CryptContext
from App.Model.user import User
import uuid
from fastapi import HTTPException

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

def login_user(user_data, db: Session):
    user = db.query(User).filter(User.email_id == user_data.email_id).first()
    
    if not user:
        return {"message": "Invalid Email ID"}
    
    if not pwd_context.verify(user_data.password, user.password):
        return {"message": "Invalid password"}
    
    return {"message": "Login successfully"}


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