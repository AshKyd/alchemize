import "./Spinner.css";

export function Spinner() {
  return (
    <div className="spinner">
      <div className="spinner__animation"></div>
      <p class="spinner__text">Loading editor&hellip;</p>
    </div>
  );
}
