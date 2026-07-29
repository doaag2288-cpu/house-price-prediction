import joblib

from app.core.config import settings
from app.schemas.prediction import PredictionRequest
from app.services.preprocessing import request_to_dataframe

_model = None


def load_model() -> None:
    """Load the trained pipeline once at application startup."""
    global _model
    _model = joblib.load(settings.model_path)


def predict_price(payload: PredictionRequest) -> float:
    if _model is None:
        raise RuntimeError("Model is not loaded yet.")
    df = request_to_dataframe(payload)
    prediction = _model.predict(df)
    return float(prediction[0])
