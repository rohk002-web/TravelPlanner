import uuid
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from App.Model.Itineraries import Itinerary
from App.Model.user import User

def save_itinerary_data(db: Session, user_id: str, itinerary_json: dict) -> dict:

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User ID is invalid. Could not save itinerary."
        )

    try:
        # Create a new itinerary
        itinerary = Itinerary(
            id=uuid.uuid4(),
            user_id=user_id,
            itinerary_data=itinerary_json
        )
        db.add(itinerary)
        db.commit()
        db.refresh(itinerary)

        return {
            "id": str(itinerary.id),
            "message": "Successfully saved itinerary."
        }

    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to save itinerary due to a database integrity error."
        )