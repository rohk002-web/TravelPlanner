from sqlalchemy.orm import Session
from passlib.context import CryptContext
from App.Model.user import User
import uuid

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")  # Ensure argon2_cffi installed

def create_user_service(user_data, db: Session):
    existing_user = db.query(User).filter(User.email_id == user_data.email_id).first()
    if existing_user:
        return {"message": "User with this email already exists"}

    hashed_password = pwd_context.hash(user_data.password)
    
    new_user = User(
        id=uuid.uuid4(),
        email_id=user_data.email_id,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User created successfully",
        "id": str(new_user.id),
        "email_id": new_user.email_id
    }


def login_user(user_data, db: Session):
    user = db.query(User).filter(User.email_id == user_data.email_id).first()
    
    if not user:
        return {"message": "Invalid username"}
    
    if not pwd_context.verify(user_data.password, user.password):
        return {"message": "Invalid password"}
    
    return {"message": "Login successfully"}
