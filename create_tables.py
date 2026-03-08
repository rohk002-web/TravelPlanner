# create_tables.py
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'Backend'))

from sqlalchemy import create_engine
from App.Model.user import Base
from App.Model.Itineraries import Itinerary  # Import to register the model
from App.config.db_connection import SQLALCHEMY_DATABASE_URL

print(f"Database URL: {SQLALCHEMY_DATABASE_URL}")

try:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    # Test connection
    with engine.connect() as conn:
        print("Database connection successful!")

    # Create all tables defined in Base subclasses
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")

except Exception as e:
    print(f"Error: {e}")
    print("Please check your database credentials and ensure the database exists.")