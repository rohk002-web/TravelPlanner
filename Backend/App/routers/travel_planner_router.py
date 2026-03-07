from fastapi import APIRouter
from App.schema.llm_response_schema import TravelRequest, TravelResponse
from App.Agent.travel_agent import generate_travel_plan
from App.config.authentication_service import get_current_user
from fastapi import Depends

router = APIRouter()


@router.post("/travel-plan", response_model=TravelResponse)
async def create_travel_plan(request: TravelRequest):
    itinerary = await generate_travel_plan(request)  
    return TravelResponse(itinerary=itinerary)