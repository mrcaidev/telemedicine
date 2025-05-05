from enum import IntEnum, unique, auto

@unique
class RespCode(IntEnum):
    SUCCESS        = 200
    NOT_FOUND      = 404
    SERVER_INTERNAL_ERROR = 500