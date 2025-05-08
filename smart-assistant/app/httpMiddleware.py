from fastapi import Request, HTTPException, Response
from app.respCode import RespCode
from app.model import ResponseData
async def validate_request_header(request: Request):
    user_id = request.headers.get("X-User-Id")
    role = request.headers.get("X-User-Role")
    if user_id is None or user_id == "":
        return ResponseData(code=RespCode.NOT_LOGIN_IN, message="User Not Login in", data=None)
    if role != "patient" or role is None or role == "":
        return ResponseData(code=RespCode.UNAUTHORIZED, message="Unauthorized", data=None)
