import { useState, useEffect } from "react";
import "./App.css";

import ModeSelector  from "./components/ModeSelector";
import RawForm       from "./components/RawForm";
import WeightedForm  from "./components/WeightedForm";

export default function App() {
  /* 1 ───────── state */
  const [phase, setPhase]         = useState("choose"); // choose → form
  const [mode, setMode]           = useState(null);     // "raw" | "weighted"
  const [participantId, setPid]   = useState("");
  const [condition,     setCond]  = useState("");

  // New states for Google Sheets functionality
  // const [saveMethod, setSaveMethod] = useState("csv"); // "csv" or "sheets"
  const [saveMethod, setSaveMethod] = useState("sheets"); // "csv" or "sheets"
  const [sheetsUrl, setSheetsUrl] = useState("");
  const [sheetName, setSheetName] = useState("NASA_TLX_Data");

  const LS_SHEETS_URL  = "nasaTlxSheetsUrl";
  const LS_SHEET_NAME  = "nasaTlxSheetName";
  const LS_SAVE_METHOD = "nasaTlxSaveMethod";


  // Initialize session tracking
  useEffect(() => {
    console.log('NASA TLX App mounted successfully');

    // Initialize session tracking
    if (!sessionStorage.getItem('nasaTlxSessionStart')) {
      sessionStorage.setItem('nasaTlxSessionStart', Date.now().toString());
    }
  }, []);

  useEffect(() => {
  const savedUrl = localStorage.getItem(LS_SHEETS_URL);
  const savedSheetName = localStorage.getItem(LS_SHEET_NAME);
  const savedSaveMethod = localStorage.getItem(LS_SAVE_METHOD);

  if (savedUrl) setSheetsUrl(savedUrl);
  if (savedSheetName) setSheetName(savedSheetName);
  if (savedSaveMethod) setSaveMethod(savedSaveMethod);
}, []);

  useEffect(() => {
  if (sheetsUrl) {
    localStorage.setItem(LS_SHEETS_URL, sheetsUrl);
  }
}, [sheetsUrl]);

useEffect(() => {
  if (sheetName) {
    localStorage.setItem(LS_SHEET_NAME, sheetName);
  }
}, [sheetName]);

useEffect(() => {
  if (saveMethod) {
    localStorage.setItem(LS_SAVE_METHOD, saveMethod);
  }
}, [saveMethod]);


  useEffect(() => {
  if (sheetsUrl) {
    setSaveMethod("sheets");
  }
}, [sheetsUrl]);



  /* 2 ───────── advance once user picks a mode */
  function handleModePick(choice) {
    setMode(choice);
    setPhase("form");
  }

  /* 3 ───────── render */
  return (
    <div className="container">
      <h1>NASA TLX Questionnaire</h1>
      <a
        href="https://github.com/mbraihan/nasa-tlx-web-app"
        target="_blank"
        rel="noopener noreferrer"
        className="btn github-btn"
        aria-label="GitHub repository"
      >
        {/* Octocat SVG from Universe.io */}
        <svg
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="#0d0d0d"
          aria-hidden="true"
        >
          <path d="M12 .5C5.5.5.5 5.5.5 12a11.5 11.5 0 008 11c.5.1.7-.2.7-.5v-2.2c-3.3.7-4-1.4-4-1.4a3.2 3.2 0 00-1.3-1.7c-1-.7 0-.7
          0-.7a2.6 2.6 0 011.9 1.3 2.6 2.6 0 003.5 1 2.6 2.6 0 01.7-1.6c-2.6-.3-5.3-1.3-5.3-5.7a4.4 4.4 0 011.2-3 4.1 4.1 0 01.1-3s1-.3 3.3 1.3a11.4
          11.4 0 016 0C16.9 6.2 18 6.5 18 6.5a4.1 4.1 0 01.1 3 4.4 4.4 0 011.2 3c0 4.4-2.7 5.3-5.3 5.6a3 3 0 01.9 2.4v3.6c0
          .3.2.6.7.5a11.5 11.5 0 008-11C23.5 5.5 18.5.5 12 .5z" />
        </svg>
      </a>

      {/* ▸▸  STEP 1: pick Raw / Weighted  ▸▸ */}
      {phase === "choose" && (
        <ModeSelector onPick={handleModePick} />
      )}

      {/* ▸▸  STEP 2: questionnaire  ▸▸ */}
      {phase === "form" && (
        <>
          {/* Meta fields container with enhanced styling */}
          <div className="meta-container">
            {/* Participant and Condition fields */}
            <div className="meta-row">
              <div className="field">
                <label>Participant&nbsp;ID:&nbsp;</label>
                <input value={participantId} onChange={e => setPid(e.target.value)}
                      placeholder="e.g., P01"/>
              </div>
              <div className="field">
                <label>Condition:&nbsp;</label>
                <input value={condition} onChange={e => setCond(e.target.value)}
                      placeholder="e.g., With / Without" />
              </div>
            </div>

            {/* Save Method Selection */}
            <div className="save-method-row">
              <div className="save-method-group">
                <label className="save-method-title">Save Method:</label>
                <div className="save-method-options">
                  <label className="save-method-option">
                    <input
                      type="radio"
                      name="saveMethod"
                      value="csv"
                      checked={saveMethod === "csv"}
                      onChange={(e) => setSaveMethod(e.target.value)}
                      className="radio-input-small"
                    />
                    <span className="save-method-label">Download CSV</span>
                  </label>
                  <label className="save-method-option">
                    <input
                      type="radio"
                      name="saveMethod"
                      value="sheets"
                      checked={saveMethod === "sheets"}
                      onChange={(e) => setSaveMethod(e.target.value)}
                      className="radio-input-small"
                    />
                    <span className="save-method-label">Save to Google Sheets</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Google Sheets Options */}
            {saveMethod === 'sheets' && (
              <div className="sheets-options">
                <div className="meta-row">
                  <div className="field">
                    <label>Google Sheets URL:</label>
                    <input
                      type="url"
                      value={sheetsUrl}
                      onChange={(e) => setSheetsUrl(e.target.value)}
                      placeholder="https://docs.google.com/spreadsheets/d/..."
                    />
                  </div>
                  <div className="field">
                    <label>Sheet Name:</label>
                    <input
                      type="text"
                      value={sheetName}
                      onChange={(e) => setSheetName(e.target.value)}
                      placeholder="NASA_TLX_Data"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <hr style={{opacity:.15}} />

          {/* pass meta + validation + save options */}
          {mode === "raw" && (
            <RawForm
              participantId={participantId}
              condition={condition}
              metaValid={participantId.trim() && condition.trim()}
              saveMethod={saveMethod}
              sheetsUrl={sheetsUrl}
              sheetName={sheetName}
            />
          )}
          {mode === "weighted" && (
            <WeightedForm
              participantId={participantId}
              condition={condition}
              metaValid={participantId.trim() && condition.trim()}
              saveMethod={saveMethod}
              sheetsUrl={sheetsUrl}
              sheetName={sheetName}
            />
          )}
        </>
      )}
      <footer className="footer">
      © 2025 Mohammad Raihanul Bashar — Developed with ❤️
      </footer>

    </div>
  );
}
