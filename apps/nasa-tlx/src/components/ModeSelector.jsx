export default function ModeSelector({ onPick }) {
    return (
        <div className="mode-selector">
        <button onClick={() => onPick("raw")}>Raw TLX</button>
        <button onClick={() => onPick("weighted")}>Weighted TLX</button>
        </div>
    );
}
