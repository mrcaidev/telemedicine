from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

class SessionData(BaseModel):
    userId: UUID
    sessionId: UUID
    createdAt: datetime = datetime.now()

class Evaluation(BaseModel):
    symptom:str | None
    urgency:int | None
    suggestion:str | None

class get_all_session_data(BaseModel):
    id: str
    evaluation: Evaluation
    createdAt: datetime

class chatbotReply(BaseModel):
    type: str
    content: str
    role: str

class chatbotEvaluation(BaseModel):
    type: str
    symptom: str
    urgency: int
    suggestion: str


class ResponseData(BaseModel):
    code: int
    message: str
    data: object|None