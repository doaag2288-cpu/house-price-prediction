import pytest
from fastapi.testclient import TestClient
 
from app.main import app
 
 
@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c
 
 
def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
 
 
def test_predict_happy_path(client):
    payload = {
        "location": "new-delhi",
        "carpet_area_sqft": 1200,
        "floor_num": 3,
        "bathroom": 2,
        "balcony": 1,
        "furnishing": "Semi-Furnished",
        "transaction": "Resale",
        "ownership": "Freehold",
        "facing": "East",
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert "predicted_price" in body
    assert isinstance(body["predicted_price"], float)
 
 
def test_predict_invalid_input(client):
    # carpet_area_sqft is missing / area must be > 0, so this should fail validation
    payload = {
        "location": "new-delhi",
        "carpet_area_sqft": -10,
        "floor_num": 3,
        "bathroom": 2,
        "balcony": 1,
        "furnishing": "Semi-Furnished",
        "transaction": "Resale",
        "ownership": "Freehold",
        "facing": "East",
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 422