import os
import json
from dotenv import load_dotenv
from google import genai
from App.Agent.prompt import TRAVEL_AGENT_PROMPT
from redis.asyncio import Redis

load_dotenv()
redis_client = Redis.from_url(os.getenv("REDIS_URL"))


async def generate_travel_plan(data):
    cache_key = f"travel_plan:{data.destination}:{data.travel_style}:{data.days}:{data.no_of_persons}:{data.budget_min}:{data.budget_max}"
    cached_itinerary = await redis_client.get(cache_key)
    if cached_itinerary:
        print("---------------from cache ----------------")
        return json.loads(cached_itinerary)
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    prompt = TRAVEL_AGENT_PROMPT.format(
        destination=data.destination,
        style=data.travel_style,
        days=data.days,
        no_of_persons=data.no_of_persons,
        budget_min=data.budget_min,
        budget_max=data.budget_max
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt
    )

    # Clean the response text
    text = response.text.strip()
    if text.startswith("```json"):
        text = text[7:]  # Remove ```json
    if text.endswith("```"):
        text = text[:-3]  # Remove ```
    text = text.strip()

    # Parse as JSON
    try:
        itinerary = json.loads(text)
        await redis_client.set(cache_key, json.dumps(itinerary), ex=3600)
        return itinerary
    except json.JSONDecodeError:
        # If parsing fails, return the cleaned text as error
        return {"error": "Failed to parse itinerary", "raw": text}