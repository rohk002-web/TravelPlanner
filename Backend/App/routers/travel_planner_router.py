from fastapi import APIRouter
from App.service.authentication_service import get_current_user
from App.Agent.travel_agent import generate_travel_plan
from App.schema.llm_response_schema import TravelRequest, TravelResponse
from fastapi import Depends , HTTPException
from App.schema.itineraries_scehma import ItinerarySchema, ItineraryResponse
from App.config.db_connection import get_db
from App.service.itineraries_service import save_itinerary_data , update_itinerary_data , delete_itinerary_by_id , get_itinerary_by_id
from App.Model.Itineraries import Itinerary
from sqlalchemy.orm import Session
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from App.Model.user import User

router = APIRouter(tags=["Travel Planner"])


@router.get("/get-itinerary/{itinerary_id}")
async def get_itinerary(itinerary_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_itinerary_by_id(db, itinerary_id, current_user)


@router.post("/travel-plan", response_model=TravelResponse)
async def create_travel_plan(request: TravelRequest, current_user: User = Depends(get_current_user)):
    itinerary = await generate_travel_plan(request)  
    return {"itinerary": itinerary}

@router.post("/save-itinerary", response_model=ItineraryResponse)
async def save_itinerary(request: ItinerarySchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return save_itinerary_data(db, request.itinerary_data, current_user)


@router.put("/update-itinerary/{itinerary_id}", response_model=ItineraryResponse)
async def update_itinerary(itinerary_id: str, request: ItinerarySchema, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return update_itinerary_data(db, itinerary_id, request.itinerary_data, current_user)


@router.delete("/delete-itinerary/{itinerary_id}")
async def delete_itinerary(itinerary_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return delete_itinerary_by_id(db, itinerary_id, current_user)

@router.get("/download-itinerary/{itinerary_id}", summary="Download itinerary as PDF")
def download_itinerary_pdf(itinerary_id: str, db: Session = Depends(get_db) , current_user: User = Depends(get_current_user)):
    # Fetch itinerary
    itinerary_record = db.query(Itinerary).filter(Itinerary.id == itinerary_id).first()
    if not itinerary_record:
        raise HTTPException(status_code=404, detail="Itinerary not found")

    data = itinerary_record.itinerary_data

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    elements = []

    styles = getSampleStyleSheet()
    title_style = styles["Heading1"]
    h2_style = styles["Heading2"]
    normal_style = styles["Normal"]

    # Title & basic info
    elements.append(Paragraph(f"Travel Itinerary: {data.get('place', '')}", title_style))
    elements.append(Spacer(1, 12))
    elements.append(Paragraph(f"Travel Style: {data.get('travel_style', '')}", normal_style))
    elements.append(Paragraph(f"Number of Persons: {data.get('no_of_persons', '')}", normal_style))
    elements.append(Paragraph(f"Estimated Cost: {data.get('total_estimated_cost_inr', '')}", normal_style))
    elements.append(Spacer(1, 12))

    # Days
    days = data.get("days", {})
    for day, details in days.items():
        elements.append(Paragraph(f"{day.title()}", h2_style))
        elements.append(Paragraph(f"Plan: {details.get('plan','')}", normal_style))
        elements.append(Paragraph(f"Hotel: {details.get('hotel','')}", normal_style))
        elements.append(Paragraph(f"Food: {details.get('food','')}", normal_style))
        elements.append(Spacer(1, 12))

    # Build PDF
    doc.build(elements)

    buffer.seek(0)
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=itinerary_{itinerary_id}.pdf"}
    )
