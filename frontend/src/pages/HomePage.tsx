import PredictionForm from "../components/PredictionForm";

export default function HomePage() {
  return (
    <div className="page">
      <h1>House Price Prediction</h1>
      <p className="subtitle">
        Enter the property details below to get an estimated price.
      </p>
      <PredictionForm />
    </div>
  );
}
