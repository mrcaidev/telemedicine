from uuid import UUID

import app.session as session
import app.chatbot as chatbot

async def create_session(user_id:UUID, id:UUID):
    await session.insert_session(user_id, id)

async def get_session(id:UUID):
    return await session.get_session(id)

async def get_user_history(user_id):
    history_list = await session.get_user_history(user_id)
    return history_list

async def speak_to_agent(id: UUID, message:str):
    return await chatbot.speak_to_bot(id, message)

async def delete_session(id: UUID):
    return await session.delete_session(id)

async def test_mongo():
    return await session.test_connect()