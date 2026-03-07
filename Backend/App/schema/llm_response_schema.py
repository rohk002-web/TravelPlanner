from pydantic import BaseModel, Field
from typing import Dict, Any

class TravelRequest(BaseModel):
    destination: str = Field(..., example="Bali")
    travel_style: str = Field(..., example="romantic")
    no_of_persons: int = Field(..., gt=0, example=2)
    days: int = Field(..., gt=0, example=4)
    budget_min: int = Field(..., gt=0, example=50000)  # in INR
    budget_max: int = Field(..., gt=0, example=200000) # in INR

class TravelResponse(BaseModel):
    itinerary: Dict[str, Any]