from fastapi import FastAPI
from App.routers import user_router , travel_planner_router
import uvicorn

app = FastAPI()

app.include_router(user_router.router)
app.include_router(travel_planner_router.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

