import { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { predictPrice, fetchLocations, ApiError } from "../api/predictionClient";
import type { PredictionRequest } from "../types/prediction";

const FURNISHING_OPTIONS = ["Furnished", "Semi-Furnished", "Unfurnished"];
const TRANSACTION_OPTIONS = ["New Property", "Resale"];
const OWNERSHIP_OPTIONS = ["Freehold", "Leasehold", "Co-operative Society", "Power Of Attorney"];
const FACING_OPTIONS = ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"];

const initialForm: PredictionRequest = {
  location: "",
  carpet_area_sqft: 0,
  floor_num: 0,
  bathroom: 1,
  balcony: 0,
  furnishing: "Semi-Furnished",
  transaction: "Resale",
  ownership: "Freehold",
  facing: "East",
};

export default function PredictionForm() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<string[]>([]);
  const [form, setForm] = useState<PredictionRequest>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    fetchLocations().then(setLocations);
  }, []);

  function updateField<K extends keyof PredictionRequest>(
    key: K,
    value: PredictionRequest[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.location.trim()) next.location = "Please select a location.";
    if (!form.carpet_area_sqft || form.carpet_area_sqft <= 0)
      next.carpet_area_sqft = "Carpet area must be greater than 0.";
    if (form.floor_num < 0) next.floor_num = "Floor cannot be negative.";
    if (form.bathroom < 0) next.bathroom = "Bathrooms cannot be negative.";
    if (form.balcony < 0) next.balcony = "Balconies cannot be negative.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await predictPrice(form);
      navigate("/result", { state: { predictedPrice: result.predicted_price } });
    } catch (err) {
      if (err instanceof ApiError) {
        setApiError(err.message);
      } else {
        setApiError("Unexpected error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="prediction-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="location">Location</label>
        <select
          id="location"
          value={form.location}
          onChange={(e) => updateField("location", e.target.value)}
        >
          <option value="">Select a location</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        {errors.location && <p className="error">{errors.location}</p>}
      </div>

      <div className="field">
        <label htmlFor="carpet_area_sqft">Carpet area (sqft)</label>
        <input
          id="carpet_area_sqft"
          type="number"
          min={0}
          value={form.carpet_area_sqft || ""}
          onChange={(e) =>
            updateField("carpet_area_sqft", Number(e.target.value))
          }
        />
        {errors.carpet_area_sqft && (
          <p className="error">{errors.carpet_area_sqft}</p>
        )}
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="floor_num">Floor number</label>
          <input
            id="floor_num"
            type="number"
            value={form.floor_num}
            onChange={(e) => updateField("floor_num", Number(e.target.value))}
          />
          {errors.floor_num && <p className="error">{errors.floor_num}</p>}
        </div>

        <div className="field">
          <label htmlFor="bathroom">Bathrooms</label>
          <input
            id="bathroom"
            type="number"
            min={0}
            value={form.bathroom}
            onChange={(e) => updateField("bathroom", Number(e.target.value))}
          />
          {errors.bathroom && <p className="error">{errors.bathroom}</p>}
        </div>

        <div className="field">
          <label htmlFor="balcony">Balconies</label>
          <input
            id="balcony"
            type="number"
            min={0}
            value={form.balcony}
            onChange={(e) => updateField("balcony", Number(e.target.value))}
          />
          {errors.balcony && <p className="error">{errors.balcony}</p>}
        </div>
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="furnishing">Furnishing</label>
          <select
            id="furnishing"
            value={form.furnishing}
            onChange={(e) =>
              updateField(
                "furnishing",
                e.target.value as PredictionRequest["furnishing"]
              )
            }
          >
            {FURNISHING_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="transaction">Transaction</label>
          <select
            id="transaction"
            value={form.transaction}
            onChange={(e) =>
              updateField(
                "transaction",
                e.target.value as PredictionRequest["transaction"]
              )
            }
          >
            {TRANSACTION_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="ownership">Ownership</label>
          <select
            id="ownership"
            value={form.ownership}
            onChange={(e) => updateField("ownership", e.target.value)}
          >
            {OWNERSHIP_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="facing">Facing</label>
          <select
            id="facing"
            value={form.facing}
            onChange={(e) => updateField("facing", e.target.value)}
          >
            {FACING_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {apiError && <p className="api-error">{apiError}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Predicting…" : "Predict price"}
      </button>
    </form>
  );
}
