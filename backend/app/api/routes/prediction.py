from fastapi import APIRouter

from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.services import inference

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok"}


@router.post("/predict", response_model=PredictionResponse)
def predict(payload: PredictionRequest):
    predicted_price = inference.predict_price(payload)
    return PredictionResponse(predicted_price=predicted_price)
