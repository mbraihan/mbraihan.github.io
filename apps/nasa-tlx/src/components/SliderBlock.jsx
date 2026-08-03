export default function SliderBlock({ label, description, value, setValue }) {
  const TICKS = Array.from({ length: 20 });
  return (
    <div className="slider-row">
      {/* left: scale */}
      <div className="slider-scale">
        <span className="slider-label">{label}</span>

        <input
          type="range"
          min="1"
          max="20"
          value={value}
          onChange={e => setValue(Number(e.target.value))}
        />

        <div className="ticks">
          {TICKS.map((_, i) => <span key={i} className="tick" />)}
        </div>

        <div className="anchors">
          <span>{label === "Performance" ? "Good" : "Low"}</span>
          <span>{label === "Performance" ? "Poor" : "High"}</span>
        </div>
      </div>

      {/* right: description */}
      <p className="slider-desc">{description}</p>
    </div>
  );
}
