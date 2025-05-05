import asyncio
import os
import json
from uuid import UUID
import re

import app.session as session
from openai import OpenAI

# Set your agent endpoint and access key as environment variables in your OS.
agent_endpoint = "https://rple22irdjo2o7ujic6jsgqy.agents.do-ai.run/api/v1/"
agent_access_key = "KkkSNvyp5VGydbd4u8kWS6a6BeaInBI_"

default_message = []


client = OpenAI(
        base_url = agent_endpoint,
        api_key = agent_access_key,
    )


async def speak_to_bot(id: UUID, user_message):
    history = await session.get_session_history(id)
    if history is None:
        history = default_message
    user = {"role":"user", "content":user_message}
    history.append(user)
    response = client.chat.completions.create(
        model="n/a",
        messages=history,
        extra_body={"include_retrieval_info": True},
    )
    assistant_reply = response.choices[0].message.content
    history.append({"role": "assistant", "content": assistant_reply})
    await session.update_session_history(id, history)
    symptom, urgency, suggestion = parse_evaluation_results(assistant_reply)
    if symptom and urgency and suggestion:
        await save_evaluation_results(id, symptom, urgency, suggestion)
    return assistant_reply


def parse_evaluation_results(message: str):
    pattern = r"\[Evaluation Results\]\s*Symptom:\s*(.*?)\s*Urgency:\s*(.*?)\s*Suggestion:\s*(.*)"
    match = re.search(pattern, message, re.DOTALL)
    if match:
        symptom = match.group(1).strip()
        urgency = match.group(2).strip()
        suggestion = match.group(3).strip()
        return symptom, urgency, suggestion
    return None, None, None


async def save_evaluation_results(id, symptom, urgency, suggestion):
    print(
        f"评估结果已保存：\n"
        f"会话ID: {id}\n"
        f"症状描述: {symptom}\n"
        f"紧急程度: {urgency}\n"
        f"处理建议: {suggestion}"
    )
    # 添加保存逻辑
    await session.update_session_evaluation(
        id=id,
        symptom=symptom,
        urgency=urgency,
        suggestion=suggestion,
    )