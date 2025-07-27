import os  # 导入操作系统接口模块
from dotenv import load_dotenv

load_dotenv()


# AI config
AGENT_ENDPOINT = os.getenv("AGENT_ENDPOINT")
AGENT_ACCESS_KEY = os.getenv("AGENT_ACCESS_KEY")


#Redis config
REDIS_URL = os.getenv("REDIS_URL")

#MongoDB config
MONGO_URL = os.getenv("MONGO_URL")

#Dify api key
DIFY_API_KEY = os.getenv("DIFY_API_KEY")