import asyncio
import os
import json
from uuid import UUID
import re

import app.session as session
from openai import OpenAI
import app.config as config

# Set your agent endpoint and access key as environment variables in your OS.
agent_access_key = config.AGENT_ACCESS_KEY

default_message = {"role":"system","content": "You are a professional and polite medical assistant. Your job is to talk with the patient, understand their symptoms step by step, and finally provide a summary in structured form."
                                               "Please follow these rules strictly:"
                                               "1. Ask only one question at a time."
                                               "2. Each question must be no longer than 50 words."
                                               "3. Be extremely polite and considerate in tone."
                                               "4. Ask follow-up questions to clarify the symptom until you can make a basic assessment."
                                               "5. At the end of the conversation, output the evaluation results in the following format **only**:"
                                               "[Evaluation Results]"
                                               "Symptom: <a short summary of the main symptom>"
                                               "Urgency: from 1 to 3, 1 for Low, 2 for Medium, 3 for High"
                                               "Suggestion: <Which department to visit, or whether to seek emergency care>"
                                               "Example:"
                                               "[Evaluation Results]"
                                               "Symptom: chest tightness and shortness of breath"
                                               "Urgency: 3"
                                               "Suggestion: Visit the emergency room immediately"
                                               "Your answers should be informative and caring. "
                                               "Start the conversation by gently asking the patient about their main discomfort."
                                               "6. Do not output anything else after the evaluation result. Do not include any polite closing or explanation."
                                               "Your answers should be informative and caring during the conversation. But once you output the `[Evaluation Results]`, end the conversation immediately."}


client = OpenAI(
        api_key = agent_access_key
    )


async def speak_to_bot(id: UUID, user_message):
    history = await session.get_session_history(id)
    if history is None:
        history = []
    user = {"role":"user", "content":user_message}
    history.append(user)
    temp_history = history.copy()
    temp_history.insert(0, default_message)
    response = client.chat.completions.create(
        model="gpt-4",
        messages=temp_history,
    )
    assistant_reply = response.choices[0].message.content
    symptom, urgency, suggestion = parse_evaluation_results(assistant_reply)

    if symptom and urgency and suggestion:
        # 说明产出了诊断结果，保存诊断结果，本轮对话不记录
        await save_evaluation_results(id, symptom, urgency, suggestion)
        await session.update_session_history(id, history)
        return {"role": "assistant", "symptom": symptom,"urgency":urgency, "suggestion":suggestion, "type": "evaluation"}
    else:
        # 没有产出诊断，保留记录，继续对话
        history.append({"role": "assistant", "content": assistant_reply})
        await session.update_session_history(id, history)
    return {"role": "assistant", "content": assistant_reply, "type": "message"}


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
    # 添加保存逻辑
    await session.update_session_evaluation(
        id=id,
        symptom=symptom,
        urgency=urgency,
        suggestion=suggestion,
    )