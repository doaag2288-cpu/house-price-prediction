import json

import pandas as pd

from app.core.config import settings
from app.schemas.prediction import PredictionRequest

_allowed_locations: set[str] | None = None


def _load_allowed_locations() -> set[str]:
    global _allowed_locations
    if _allowed_locations is None:
        with open(settings.locations_path, "r") as f:
            _allowed_locations = set(json.load(f))
    return _allowed_locations


def request_to_dataframe(payload: PredictionRequest) -> pd.DataFrame:
    """
    Build a one-row DataFrame with exactly the column names used during
    training. Unknown locations are mapped to "other", matching the
    grouping done in the training notebook.
    """
    allowed_locations = _load_allowed_locations()
    location_grouped = payload.location if payload.location in allowed_locations else "other"

    row = {
        "carpet_area_sqft": payload.carpet_area_sqft,
        "floor_num": payload.floor_num,
        "bathroom_num": payload.bathroom,
        "balcony_num": payload.balcony,
        "location_grouped": location_grouped,
        "Furnishing": payload.furnishing,
        "Transaction": payload.transaction,
        "Ownership": payload.ownership,
        "facing": payload.facing,
    }
    return pd.DataFrame([row])
