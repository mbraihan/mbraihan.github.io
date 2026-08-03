import React, { useState, useEffect } from "react";
import "./App.css";
import { downloadCSV, saveToGoogleSheets } from "./utils/csvUtils";

const QUESTIONS_FULL = [
  ["annoying", "enjoyable"],
  ["not understandable", "understandable"],
  ["creative", "dull"],
  ["easy to learn", "difficult to learn"],
  ["valuable", "inferior"],
  ["boring", "exciting"],
  ["not interesting", "interesting"],
  ["unpredictable", "predictable"],
  ["fast", "slow"],
  ["inventive", "conventional"],
  ["obstructive", "supportive"],
  ["good", "bad"],
  ["complicated", "easy"],
  ["unlikable", "pleasing"],
  ["usual", "leading edge"],
  ["unpleasant", "pleasant"],
  ["secure", "not secure"],
  ["motivating", "demotivating"],
  ["meets expectations", "does not meet expectations"],
  ["inefficient", "efficient"],
  ["clear", "confusing"],
  ["impractical", "practical"],
  ["organized", "cluttered"],
  ["attractive", "unattractive"],
  ["friendly", "unfriendly"],
  ["conservative", "innovative"],
];

const QUESTIONS_SHORT = [
  ["obstructive", "supportive"],
  ["complicated", "easy"],
  ["inefficient", "efficient"],
  ["clear", "confusing"],
  ["boring", "exciting"],
  ["not interesting", "interesting"],
  ["conventional", "inventive"],
  ["usual", "leading edge"],
];

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <span className="toast-icon">
          {type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
        </span>
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

function App() {
  const [ueqVersion, setUeqVersion] = useState("");
  const [participantID, setParticipantID] = useState("");
  const [condition, setCondition] = useState("");
  const [answers, setAnswers] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSaveOption, setSelectedSaveOption] = useState('local');
  const [googleSheetUrl, setGoogleSheetUrl] = useState("");
  const [sheetName, setSheetName] = useState("UEQ");

  // Get current questions and total based on selected version
  const currentQuestions = ueqVersion === 'short' ? QUESTIONS_SHORT : QUESTIONS_FULL;
  const totalQuestions = currentQuestions.length;

  // Initialize answers array when version changes
  React.useEffect(() => {
    if (ueqVersion) {
      setAnswers(Array(totalQuestions).fill(""));
    }
  }, [ueqVersion, totalQuestions]);

  // Handle scroll indicators for questionnaire
  React.useEffect(() => {
    const questionGrid = document.querySelector('.question-grid');
    const questionnaire = document.querySelector('.questionnaire');

    if (questionGrid && questionnaire) {
      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = questionGrid;
        const canScrollUp = scrollTop > 0;
        const canScrollDown = scrollTop < scrollHeight - clientHeight - 1;

        questionnaire.classList.toggle('can-scroll-up', canScrollUp);
        questionnaire.classList.toggle('can-scroll-down', canScrollDown);
      };

      questionGrid.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check

      return () => questionGrid.removeEventListener('scroll', handleScroll);
    }
  }, [ueqVersion]);

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const validateForm = () => {
    if (!ueqVersion) {
      showToast('Please select UEQ version (Short or Full)', 'error');
      return false;
    }

    if (!participantID.trim()) {
      showToast('Please enter a Participant ID', 'error');
      return false;
    }

    if (!condition.trim()) {
      showToast('Please enter a Condition', 'error');
      return false;
    }

    const emptyAnswers = answers.filter(answer => answer === "").length;
    if (emptyAnswers > 0) {
      showToast(`Please complete all questions (${emptyAnswers} remaining)`, 'error');
      return false;
    }

    // Validate Google Sheets URL if that option is selected
    if (selectedSaveOption === 'googlesheets') {
      if (!googleSheetUrl.trim()) {
        showToast('Please enter a Google Sheets URL', 'error');
        return false;
      }

      if (!sheetName.trim()) {
        showToast('Please enter a sheet name', 'error');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      showToast('Already submitting! Please wait...', 'info');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Prepare data for UEQ
    const ueqData = {
      participantID,
      condition,
      ueqVersion: ueqVersion === 'short' ? 'Short' : 'Full',
      questions: currentQuestions.map((question, index) => ({
        questionNumber: index + 1,
        questionLeft: question[0],
        questionRight: question[1],
        response: parseInt(answers[index])
      })),
      timestamp: new Date().toISOString()
    };

    try {
      let result;

      switch (selectedSaveOption) {
        case 'local':
          downloadCSV(ueqData, `${participantID}_${condition}_UEQ_${ueqVersion === 'short' ? 'Short' : 'Full'}`);
          result = { success: true, message: '✨ UEQ data downloaded successfully!' };
          break;

        case 'googlesheets':
          showToast('Saving to Google Sheets...', 'info');
          result = await saveToGoogleSheets(ueqData, googleSheetUrl, sheetName);
          break;

        default:
          result = { success: false, message: 'Invalid save option selected' };
      }

      if (result.success) {
        showToast(result.message, 'success');

        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSubmitting(false);
          setUeqVersion("");
          setParticipantID("");
          setCondition("");
          setAnswers([]);
          if (selectedSaveOption === 'googlesheets') {
            setGoogleSheetUrl("");
            setSheetName("UEQ");
          }
          showToast('Form reset - ready for next participant', 'info');
        }, 3000);
      } else {
        setIsSubmitting(false);
        showToast(result.message, 'error');
      }
    } catch (error) {
      setIsSubmitting(false);
      showToast(`Submission failed: ${error.message}`, 'error');
    }
  };

  const completedQuestions = answers.filter(answer => answer !== "").length;
  const progress = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">
            UEQ Questionnaire
            {ueqVersion && <span> - {ueqVersion === 'short' ? 'Short Version' : 'Full Version'}</span>}
          </h1>
          <a
            href="https://github.com/mbraihan/ueq-web-app"
            target="_blank"
            rel="noopener noreferrer"
            className="btn github-btn"
            aria-label="GitHub repository"
          >
            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="#0d0d0d"
              aria-hidden="true"
            >
              <path d="M12 .5C5.5.5.5 5.5.5 12a11.5 11.5 0 008 11c.5.1.7-.2.7-.5v-2.2c-3.3.7-4-1.4-4-1.4a3.2 3.2 0 00-1.3-1.7c-1-.7 0-.7 0-.7a2.6 2.6 0 011.9 1.3 2.6 2.6 0 003.5 1 2.6 2.6 0 01.7-1.6c-2.6-.3-5.3-1.3-5.3-5.7a4.4 4.4 0 011.2-3 4.1 4.1 0 01.1-3s1-.3 3.3 1.3a11.4 11.4 0 016 0C16.9 6.2 18 6.5 18 6.5a4.1 4.1 0 01.1 3 4.4 4.4 0 011.2 3c0 4.4-2.7 5.3-5.3 5.6a3 3 0 01.9 2.4v3.6c0 .3.2.6.7.5a11.5 11.5 0 008-11C23.5 5.5 18.5.5 12 .5z" />
            </svg>
          </a>
        </header>

        <div>
          <div className="form-container">
            {/* UEQ Version Selection */}
            <div className="version-selection">
              <h3 className="version-title">Select UEQ Version</h3>
              <div className="version-options">
                <label className="version-option">
                  <input
                    type="radio"
                    name="ueqVersion"
                    value="short"
                    checked={ueqVersion === 'short'}
                    onChange={(e) => setUeqVersion(e.target.value)}
                    className="version-radio"
                  />
                  <div className="version-card">
                    <h4>UEQ Short</h4>
                    <p>8 Questions • Quick Assessment</p>
                  </div>
                </label>
                <label className="version-option">
                  <input
                    type="radio"
                    name="ueqVersion"
                    value="full"
                    checked={ueqVersion === 'full'}
                    onChange={(e) => setUeqVersion(e.target.value)}
                    className="version-radio"
                  />
                  <div className="version-card">
                    <h4>UEQ Full</h4>
                    <p>26 Questions • Comprehensive Assessment</p>
                  </div>
                </label>
              </div>
            </div>

            {ueqVersion && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Participant ID</label>
                    <input
                      type="text"
                      className="form-input"
                      value={participantID}
                      onChange={(e) => setParticipantID(e.target.value)}
                      placeholder="Enter participant ID"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Condition</label>
                    <input
                      type="text"
                      className="form-input"
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      placeholder="Enter condition"
                    />
                  </div>
                </div>

                {/* Save Options */}
                <div className="save-options-container">
                  <label className="form-label">Save Options</label>
                  <div className="save-options">
                    <label className={`save-option ${selectedSaveOption === 'local' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="saveOption"
                        value="local"
                        checked={selectedSaveOption === 'local'}
                        onChange={(e) => setSelectedSaveOption(e.target.value)}
                      />
                      <div className="save-option-content">
                        <div className="save-option-title">💾 Download to PC</div>
                        <div className="save-option-desc">Save CSV file locally</div>
                      </div>
                    </label>

                    <label className={`save-option ${selectedSaveOption === 'googlesheets' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="saveOption"
                        value="googlesheets"
                        checked={selectedSaveOption === 'googlesheets'}
                        onChange={(e) => setSelectedSaveOption(e.target.value)}
                      />
                      <div className="save-option-content">
                        <div className="save-option-title">📊 Google Sheets</div>
                        <div className="save-option-desc">Save to Google Sheets</div>
                      </div>
                    </label>
                  </div>

                  {/* Google Sheets Configuration */}
                  {selectedSaveOption === 'googlesheets' && (
                    <div className="google-sheets-config">
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Sheet Name</label>
                          <input
                            type="text"
                            className="form-input"
                            value={sheetName}
                            onChange={(e) => setSheetName(e.target.value)}
                            placeholder="UEQ"
                          />
                          <div className="form-hint">
                            💡 This sheet will be created automatically if it doesn't exist
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Google Sheets URL</label>
                        <input
                          type="url"
                          className="form-input"
                          value={googleSheetUrl}
                          onChange={(e) => setGoogleSheetUrl(e.target.value)}
                          placeholder="https://docs.google.com/spreadsheets/d/..."
                        />
                        <div className="form-hint">
                          📋 Copy the URL from your Google Sheets address bar
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="progress-container">
                  <div className="progress-label">
                    Progress: {completedQuestions} of {totalQuestions} questions completed ({Math.round(progress)}%)
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </>
            )}
          </div>

          {ueqVersion && (
            <div className="questionnaire">
              <div className="question-grid">
                <div className="header-row">
                  <div className="label-cell"></div>
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <div key={num} className="header-number">{num}</div>
                  ))}
                  <div className="label-cell"></div>
                  <div className="row-number-cell">#</div>
                </div>

                {currentQuestions.map(([left, right], i) => (
                  <div className="question-row" key={i}>
                    <div className="label-cell">{left}</div>
                    {[...Array(7)].map((_, idx) => (
                      <div key={idx} className="radio-cell">
                        <input
                          type="radio"
                          name={`q${i}`}
                          value={idx - 3}
                          checked={answers[i] === String(idx - 3)}
                          onChange={(e) => handleChange(i, e.target.value)}
                          className="radio-input"
                        />
                      </div>
                    ))}
                    <div className="label-cell">{right}</div>
                    <div className="row-number-cell">{i + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="del">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>

        <footer className="footer">
          © 2025 Mohammad Raihanul Bashar. Developed with ❤️
        </footer>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;