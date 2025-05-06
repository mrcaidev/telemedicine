import os  # 导入操作系统接口模块
from dotenv import load_dotenv

load_dotenv()


# AI config
AGENT_ENDPOINT = os.getenv("AGENT_ENDPOINT")
AGENT_ACCESS_KEY = os.getenv("AGENT_ACCESS_KEY")


#Redis config
REDIS_HOST = os.getenv("REDIS_HOST")
REDIS_PORT = os.getenv("REDIS_PORT")

#MongoDB config
MONGO_HOST = os.getenv("MONGO_HOST")
MONGO_PORT = os.getenv("MONGO_PORT")