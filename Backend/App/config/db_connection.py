from dotenv import load_dotenv
import os 
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


load_dotenv() 

DB_URL = os.getenv("DATABASE_URL")
if not DB_URL:
    raise ValueError("DATABASE_URL environment variable is not set")


engine = create_engine(DB_URL)

SessionLocal = sessionmaker(autocommit=False, bind=engine)

def get_db():
    db = SessionLocal() 
    try:
        yield db      
    finally:
        db.close()     


