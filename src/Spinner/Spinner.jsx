import "./Spinner.css";

export function Spinner() {
  return (
    <div className="spinner">
      <div className="spinner__animation" aria-label="Loading…"></div>
    </div>
  );
}
