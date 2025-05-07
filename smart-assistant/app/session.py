import asyncio
import uuid
from datetime import datetime
from typing import List
from uuid import UUID
from app.model import Evaluation
import app.config as config

from pymongo import MongoClient

MONGO_URL = f"mongodb://{config.MONGO_HOST}:{config.MONGO_PORT}/"
client = MongoClient(MONGO_URL,uuidRepresentation='standard')
db = client['smart_assistant']
collection = db['session']

async def insert_session(user_id:UUID, id:UUID):
    collection.insert_one({
        "user_id": user_id,
        "id": id,
        "history": [],
        "evaluation": None,
        "createdAt": datetime.now(),
    })

async def get_session(id:UUID):
    result = collection.find_one(
        {"id": id},
        {"_id": 0, "user_id":1,"id":1,"history": 1,"evaluation":1,"createdAt":1}
    )
    if result is None:
        print("session not found")
        return None
    else:
        return result

async def get_session_history(id:UUID):
    result = collection.find_one(
        {"id": id},
        {"history": 1}
    )
    if result is None:
        return None
    return result["history"]

async def get_user_history(user_id:UUID):
    result = collection.find(
        {"user_id": user_id},
        {"_id": 0, "id": 1,"evaluation": 1,"createdAt":1}
    )
    history_list = list(result)
    return history_list

async def update_session_history(id:UUID, history:List[dict]):
    collection.update_one(
        {"id": id},
        {"$set": {"history": history}}
    )

async def update_session_evaluation(id:UUID, symptom:str, urgency:int, suggestion:str):
    collection.update_one(
        {"id": id},
        {"$set": {
            "evaluation": Evaluation(symptom=symptom, urgency=urgency, suggestion=suggestion).model_dump(),
            "updated_at": datetime.now()}}
    )
async def delete_session(id:UUID):
    session_deleted = collection.find_one_and_delete(
        {"id": id},
        {"user_id":1}
    )
    print(session_deleted)
    return session_deleted
async def delete_user_session(user_id:UUID):
    collection.delete(
        {"user_id": user_id},
    )

async def test_connect():
    try:
        collection.find_one()
    except Exception:
        return False

    return True