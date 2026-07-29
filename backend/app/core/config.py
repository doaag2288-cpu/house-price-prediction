from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    model_path: str = "models/house_price.pkl"
    locations_path: str = "models/locations.json"

    class Config:
        env_file = ".env"


settings = Settings()
