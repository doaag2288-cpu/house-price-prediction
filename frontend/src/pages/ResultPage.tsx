import { useLocation, Link, Navigate } from "react-router-dom";

function formatPrice(value: number): string {
  if (value >= 1e7) {
    return `₹ ${(value / 1e7).toFixed(2)} Cr`;
  }
  if (value >= 1e5) {
    return `₹ ${(value / 1e5).toFixed(2)} Lac`;
  }
  return `₹ ${value.toLocaleString("en-IN")}`;
}

export default function ResultPage() {
  const location = useLocation();
  const predictedPrice = (location.state as { predictedPrice?: number } | null)
    ?.predictedPrice;

  if (predictedPrice === undefined) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page">
      <h1>Predicted Price</h1>
      <p className="predicted-price">{formatPrice(predictedPrice)}</p>
      <p className="subtitle">
        This is an estimate based on the details you provided.
      </p>
      <Link to="/" className="back-link">
        ← Predict another property
      </Link>
    </div>
  );
}
