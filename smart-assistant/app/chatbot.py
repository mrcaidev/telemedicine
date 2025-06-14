import asyncio
import logging
import os
import json
from uuid import UUID
import re

import app.session as session
from openai import OpenAI, api_key
import app.config as config
from langchain.output_parsers import PydanticOutputParser
from app.model import ChatbotOutput
from langchain.prompts import ChatPromptTemplate
from langchain.chat_models import ChatOpenAI
from pydantic import ValidationError

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set your agent endpoint and access key as environment variables in your OS.
agent_access_key = config.AGENT_ACCESS_KEY
parser = PydanticOutputParser(pydantic_object=ChatbotOutput)

format_instructions = parser.get_format_instructions()

template_str = """
You are a professional and polite medical assistant. 
You will talk to the patient step by step to understand their symptoms.

Please follow these rules:
1. Ask only one question at a time, max 50 words.
2. Be extremely polite and respectful.
3. Once you understand enough, output a JSON structure as follows:
{format_instructions}

4. If still asking questions, reply as:
{{
  "type": "message",
  "message": "..."
}}

5. Never say anything outside this JSON structure.
6. Always reply in the same language as the user.

Conversation history (exclude system prompt):
{history}

Patient input: {input}
"""

prompt = ChatPromptTemplate.from_template(template_str).partial(
    format_instructions=format_instructions
)


client = OpenAI(
        api_key = agent_access_key
    )

llm = ChatOpenAI(model="gpt-4", temperature=0.0, api_key = agent_access_key)

chain = prompt | llm | parser


async def speak_to_bot(id: UUID, user_message):
    history = await session.get_session_history(id)
    if history is None:
        history = []
    user = {"role":"user", "content":user_message}
    history.append(user)
    history_str = "\n".join(
        f"{m['role'].capitalize()}: {m['content']}" for m in history
    )

    # 4. 运行 LangChain 流水线
    result: ChatbotOutput = chain.invoke({
        "history": history_str,
        "input": user_message
    })
    if result.type == "message":
        # 继续对话：保存 assistant 的这次问句到历史
        history.append({"role": "assistant", "content": result.message})
        await session.update_session_history(id, history)
        return {
            "role": "assistant",
            "content": result.message,
            "type": "message"
        }
    # Evaluation result
    await save_evaluation_results(
        id,
        result.Symptom,
        result.Urgency,
        result.Suggestion,
        result.Keywords
    )
    return {
        "role": "assistant",
        "symptom": result.Symptom,
        "urgency": result.Urgency,
        "suggestion": result.Suggestion,
        "keyword": result.Keywords,
        "type": "evaluation"
    }


async def save_evaluation_results(id, symptom, urgency, suggestion,keyword):
    # 添加保存逻辑
    await session.update_session_evaluation(
        id=id,
        symptom=symptom,
        urgency=urgency,
        suggestion=suggestion,
        keyword=keyword
    )