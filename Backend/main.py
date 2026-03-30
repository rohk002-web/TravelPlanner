from fastapi import FastAPI
from App.routers import user_router , travel_planner_router
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from App.config.db_connection import engine
from App.Model.user import Base
from App.Model.Itineraries import Itinerary

app = FastAPI()


@app.on_event("startup")
def _create_tables() -> None:
    Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router.router)
app.include_router(travel_planner_router.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

