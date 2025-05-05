from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

class SessionData(BaseModel):
    user_id: UUID
    session_id: UUID
    created_at: datetime = datetime.now()

class Evaluation(BaseModel):
    symptom:str | None
    urgency:int | None
    suggestion:str | None

class get_all_session_data(BaseModel):
    id: str
    evaluation: Evaluation
    createdAt: datetime


class ResponseData(BaseModel):
    code: int
    message: str
    data: object|None