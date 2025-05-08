from enum import IntEnum, unique, auto

@unique
class RespCode(IntEnum):
    SUCCESS        = 200
    SUCCESS_CREATE = 201
    UNAUTHORIZED = 401
    NOT_FOUND      = 404
    SERVER_INTERNAL_ERROR = 500