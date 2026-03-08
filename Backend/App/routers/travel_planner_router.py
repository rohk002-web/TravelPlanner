from fastapi import APIRouter
from App.schema.llm_response_schema import TravelRequest, TravelResponse
from App.Agent.travel_agent import generate_travel_plan
from App.config.authentication_service import get_current_user
from fastapi import Depends
from App.schema.itineraries_scehma import ItinerarySchema, ItineraryResponse
from App.config.db_connection import get_db
from App.config.itineraries_service import save_itinerary_data
from sqlalchemy.orm import Session

router = APIRouter(tags=["Travel Planner"])


@router.post("/travel-plan", response_model=TravelResponse)
async def create_travel_plan(request: TravelRequest):
    itinerary = await generate_travel_plan(request)  
    return TravelResponse(itinerary=itinerary)

@router.post("/save-itinerary/{user_id}", response_model=ItineraryResponse)
async def save_itinerary(user_id : str, request: ItinerarySchema, db: Session= Depends(get_db)):
    return save_itinerary_data(db, user_id, request.itinerary_data)
    