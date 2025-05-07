import json

from fastapi import FastAPI, Response, Request
from fastapi.responses import JSONResponse
from uuid import UUID, uuid4

from app.model import SessionData,ResponseData, chatbotReply
from app.respCode import RespCode
import app.redisUtils as RedisUtils
import app.assistant as Assistant
import logging

app = FastAPI()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# done
@app.post("/sessions", response_model=ResponseData)
async def create_session(request:Request, response: Response):
    user_id = request.headers.get("X-User-Id")
    session_id = uuid4()
    data = SessionData(userId=UUID(user_id), sessionId=session_id)
    await Assistant.create_session(UUID(user_id), session_id)
    await RedisUtils.set_key(str(user_id), data.model_dump_json())
    result = await Assistant.get_session(session_id)
    return ResponseData(code=RespCode.SUCCESS, message="success", data=result)

#done
@app.get("/sessions/active", response_model=ResponseData)
async def get_session(request: Request, response: Response):
    user_id = request.headers.get("X-User-Id")
    data = await RedisUtils.get_key(user_id)
    value = data["value"]
    session_id = json.loads(value)["session_id"]
    data = SessionData(userId=UUID(user_id), sessionId=session_id)

    return ResponseData(code=RespCode.SUCCESS, message="success", data=data)


@app.delete("/sessions/{id}", response_model=ResponseData)
async def delete_session(id: str, response: Response):
    result = await Assistant.delete_session(UUID(id))
    if result is None:
        return ResponseData(code=RespCode.NOT_FOUND, message="session not found", data=None)
    messages = await RedisUtils.delete_key(str(result["user_id"]))
    return ResponseData(code=RespCode.SUCCESS, message=messages["message"], data=None)

@app.get("/sessions/{id}", response_model=ResponseData)
async def get_session(id: str, response: Response):
    result = await Assistant.get_session(UUID(id))
    return ResponseData(code=RespCode.SUCCESS, message="success", data=result)

@app.get("/sessions", response_model=ResponseData)
async def get_user_all_sessions(request: Request, response: Response):
    user_id = request.headers.get("X-User-Id")
    result = await Assistant.get_user_history(UUID(user_id))
    return ResponseData(code=RespCode.SUCCESS, message="success", data=result)

@app.post("/sessions/{id}/chat", response_model=ResponseData)
async def speak_to_agent(id:str, request:Request, response: Response):
    body: dict = await request.json()
    message = body.get("message")
    session_id = UUID(id)
    message_reply = await Assistant.speak_to_agent(session_id, message)
    return ResponseData(code=RespCode.SUCCESS, message="success", data=chatbotReply(type=message_reply["type"], content=message_reply["content"], role=message_reply["role"]))

@app.get("/livez")
async def check_live(request: Request, response: Response):
    return ResponseData(code=RespCode.SUCCESS, message="success live check", data=None)

@app.get("/readyz")
async def check_connect_ready(request: Request, response: Response):
    result_redis = RedisUtils.test_ping()
    result_mongo = Assistant.test_mongo()
    if result_mongo and result_redis:
        return ResponseData(code=RespCode.SUCCESS, message="success", data=None)

    return ResponseData(code=RespCode.SERVER_INTERNAL_ERROR, message="server error", data=None)

