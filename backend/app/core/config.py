from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Linkaura"
    API_V1_STR: str = "/api/v1"
    FIREBASE_CREDENTIALS: str
    OPENAI_API_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()