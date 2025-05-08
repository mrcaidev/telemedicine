from fastapi import Request, HTTPException, Response

async def validate_request_header(request: Request, response: Response):
    user_id = request.headers.get("X-User-Id")
    role = request.headers.get("X-User-Role")
    if user_id is None or user_id == "" or role is None or role != "patient":
        raise HTTPException(status_code=404, detail="Unauthorized")
    return user_id