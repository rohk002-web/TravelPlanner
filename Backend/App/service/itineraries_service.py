import uuid
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from App.Model.Itineraries import Itinerary
from App.Model.user import User
from App.service.authentication_service import get_current_user
from fastapi import Depends

def get_itnerary_by_id(db: Session, itinerary_id: str, user: User):
    itinerary = db.query(Itinerary).filter(
        Itinerary.id == itinerary_id,
        Itinerary.user_id == user.id
    ).first()

    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")

    return {
        "id": str(itinerary.id),
        "itinerary_data": itinerary.itinerary_data
    }


def save_itinerary_data(db: Session, itinerary_json: dict, current_user: User = Depends(get_current_user)) -> dict:
    try:
        itinerary = Itinerary(
            id=uuid.uuid4(),
            user_id=current_user.id,
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
    
def update_itnerary_data(db: Session, itnerary_id: str, itinerary_json: dict) -> dict:

    itinerary = db.query(Itinerary).filter(Itinerary.id == itnerary_id).first()
    if not itinerary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Itinerary not found. Could not update."
        )

    try:
        itinerary.itinerary_data = itinerary_json
        db.commit()
        db.refresh(itinerary)

        return {
            "id": str(itinerary.id),
            "message": "Successfully updated itinerary."
        }

    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update itinerary due to a database integrity error."
        )

def delete_itinerary_by_id(db: Session, itinerary_id: str, user: User):
    itinerary = db.query(Itinerary).filter(
        Itinerary.id == itinerary_id,
        Itinerary.user_id == user.id
    ).first()

    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")

    db.delete(itinerary)
    db.commit()

    return {"message": "Itinerary deleted successfully"}