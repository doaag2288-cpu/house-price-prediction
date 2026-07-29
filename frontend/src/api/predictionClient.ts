import type { PredictionRequest, PredictionResponse } from "../types/prediction";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export class ApiError extends Error {}

export async function predictPrice(
  payload: PredictionRequest
): Promise<PredictionResponse> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ApiError(
      "Could not reach the server. Make sure the backend is running."
    );
  }

  if (!response.ok) {
    let detail = "Something went wrong while predicting the price.";
    try {
      const body = await response.json();
      if (body?.detail) {
        detail =
          typeof body.detail === "string"
            ? body.detail
            : JSON.stringify(body.detail);
      }
    } catch {
      // ignore parse errors, use default message
    }
    throw new ApiError(detail);
  }

  return response.json();
}

export async function fetchLocations(): Promise<string[]> {
  try {
    const response = await fetch("/locations.json");
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}
