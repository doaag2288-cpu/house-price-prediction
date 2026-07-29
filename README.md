# House Price Prediction

## Overview
This project is an end-to-end Machine Learning web application that predicts house prices based on property features.

The project includes:
- Data preprocessing and feature engineering
- Machine Learning model training and evaluation
- FastAPI backend for prediction
- React frontend for user interaction

## Project Structure

```
house-price-project/
│
├── backend/
├── frontend/
├── notebooks/
└── README.md
```

## Technologies Used

- Python
- Pandas
- Scikit-learn
- FastAPI
- React
- TypeScript
- Vite
- Git & GitHub

## Dataset

House Price Dataset from Kaggle

## Backend

```
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend URL:

```
http://127.0.0.1:8000
```

Health Check:

```
GET /health
```

Prediction API:

```
POST /predict
```

## Frontend

```
cd frontend
npm install
npm run dev
```

Frontend URL:

```
http://localhost:5173
```

## Model

The trained model is saved as:

```
backend/models/house_price.pkl
```

## Author

Doaa Gamal
