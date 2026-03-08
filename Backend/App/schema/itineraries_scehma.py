from pydantic import BaseModel
from typing import Dict, Any

class ItinerarySchema(BaseModel):
    itinerary_data: Dict[str, Any]

class ItineraryResponse(BaseModel):
    id: str
    message: str
