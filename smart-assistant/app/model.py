from pydantic import BaseModel,Field
from datetime import datetime
from uuid import UUID
from typing import Literal, Optional, List

class SessionData(BaseModel):
    userId: UUID
    sessionId: UUID
    createdAt: datetime = datetime.now()

class Evaluation(BaseModel):
    symptom:str | None
    urgency:int | None
    suggestion:str | None
    keyword: str | None

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
    keyword: str


class ResponseData(BaseModel):
    code: int
    message: str
    data: object|None

class ChatbotOutput(BaseModel):
    type: Literal["message", "Evaluation result"]
    message: Optional[str] = Field(default=None, description="If type is 'message', this is the chatbot's question to the user.")
    Symptom: Optional[str] = Field(default=None, description="If type is 'Evaluation result', short summary of the main symptom.")
    Urgency: Optional[int] = Field(default=None, description="If type is 'Evaluation result', 1 for Low, 2 for Medium, 3 for High.")
    Suggestion: Optional[str] = Field(default=None, description="If type is 'Evaluation result', recommendation like visiting a department.")
    Keywords: Optional[str] = Field(default=None, description="If type is 'Evaluation result', the recommended department as an English keyword.")