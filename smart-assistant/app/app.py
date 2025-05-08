import json

from fastapi import FastAPI, Response, Request, HTTPException, APIRouter, Depends
from fastapi.responses import JSONResponse
from uuid import UUID, uuid4

from app.model import SessionData,ResponseData, chatbotReply, chatbotEvaluation
from app.respCode import RespCode
import app.redisUtils as RedisUtils
import app.assistant as Assistant
import app.httpMiddleware as HttpMiddleware
import logging

app = FastAPI()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# done
@app.post("/sessions", response_model=ResponseData, dependencies=[Depends(HttpMiddleware.validate_request_header)])
async def create_session(request:Request, response: Response, res: ResponseData=Depends(HttpMiddleware.validate_request_header)):
    if res is not None:
        response.status_code = res["code"]
        return res
    user_id = request.headers.get("X-User-Id")
    session_id = uuid4()
    data = SessionData(userId=UUID(user_id), sessionId=session_id)
    await Assistant.create_session(UUID(user_id), session_id)
    await RedisUtils.set_key(str(user_id), data.model_dump_json())
    result = await Assistant.get_session(session_id, UUID(user_id))
    response.status_code = RespCode.SUCCESS_CREATE
    return ResponseData(code=RespCode.SUCCESS_CREATE, message="success", data=result)

#done
@app.get("/sessions/active", response_model=ResponseData, dependencies=[Depends(HttpMiddleware.validate_request_header)])
async def get_session(request: Request, response: Response, res: ResponseData=Depends(HttpMiddleware.validate_request_header)):
    if res is not None:
        response.status_code = res.code
        return res
    user_id = request.headers.get("X-User-Id")
    try:
        data = await RedisUtils.get_key(user_id)
    except HTTPException as e:
        response.status_code = RespCode.NOT_FOUND
        return ResponseData(code=RespCode.NOT_FOUND, message=e.detail, data=None)
    value = data["value"]
    session_id = json.loads(value)["sessionId"]
    data = SessionData(userId=UUID(user_id), sessionId=session_id)

    return ResponseData(code=RespCode.SUCCESS, message="success", data=data)


@app.delete("/sessions/{id}", response_model=ResponseData, dependencies=[Depends(HttpMiddleware.validate_request_header)])
async def delete_session(id: str, request:Request, response: Response, res: ResponseData=Depends(HttpMiddleware.validate_request_header)):
    if res is not None:
        response.status_code = res.code
        return res
    user_id = request.headers.get("X-User-Id")
    result = await Assistant.delete_session(UUID(id), UUID(user_id))
    if result is None:
        return ResponseData(code=RespCode.NOT_FOUND, message="session not found", data=None)

    data = await RedisUtils.get_key(user_id)
    value = data["value"]
    session_id = json.loads(value)["sessionId"]
    if id == session_id:
        await RedisUtils.delete_key(str(result["user_id"]))
    return ResponseData(code=RespCode.SUCCESS, message="success", data=None)

@app.get("/sessions/{id}", response_model=ResponseData, dependencies=[Depends(HttpMiddleware.validate_request_header)])
async def get_session(id: str, request:Request,response: Response, res: ResponseData=Depends(HttpMiddleware.validate_request_header)):
    if res is not None:
        response.status_code = res.code
        return res
    user_id = request.headers.get("X-User-Id")
    result = await Assistant.get_session(UUID(id), UUID(user_id))
    if result is None:
        response.status_code = RespCode.NOT_FOUND
        return ResponseData(code=RespCode.NOT_FOUND, message="session not found", data=None)
    return ResponseData(code=RespCode.SUCCESS, message="success", data=result)

@app.get("/sessions", response_model=ResponseData, dependencies=[Depends(HttpMiddleware.validate_request_header)])
async def get_user_all_sessions(request: Request, response: Response, res: ResponseData=Depends(HttpMiddleware.validate_request_header)):
    if res is not None:
        response.status_code = res.code
        return res
    user_id = request.headers.get("X-User-Id")
    result = await Assistant.get_user_history(UUID(user_id))
    return ResponseData(code=RespCode.SUCCESS, message="success", data=result)

@app.post("/sessions/{id}/chat", response_model=ResponseData, dependencies=[Depends(HttpMiddleware.validate_request_header)])
async def speak_to_agent(id:str, request:Request, response: Response, res: ResponseData=Depends(HttpMiddleware.validate_request_header)):
    if res is not None:
        response.status_code = res.code
        return res
    user_id = request.headers.get("X-User-Id")
    if await session_validate(id, user_id) is False:
        response.status_code = RespCode.UNAUTHORIZED
        return ResponseData(code=RespCode.UNAUTHORIZED, message="unauthorized", data=None)
    body: dict = await request.json()
    message = body.get("content")
    session_id = UUID(id)
    message_reply = await Assistant.speak_to_agent(session_id, message)
    response.status_code = RespCode.SUCCESS_CREATE
    if message_reply["type"] == "message":
        return ResponseData(code=RespCode.SUCCESS_CREATE, message="success",data=chatbotReply(type=message_reply["type"], content=message_reply["content"],role=message_reply["role"]))
    else:
        await RedisUtils.delete_key(user_id)
        return ResponseData(code=RespCode.SUCCESS_CREATE, message="success",
                            data=chatbotEvaluation(type=message_reply["type"], symptom=message_reply["symptom"],
                                                   urgency=message_reply["urgency"],
                                                   suggestion=message_reply["suggestion"]))


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

async def session_validate(id:str, user_id:str):
    try:
        data = await RedisUtils.get_key(user_id)
        value = data["value"]
        session_id = json.loads(value)["sessionId"]
        if id == session_id:
            return True
        else:
            return False
    except:
        return False

