import React, { useState, useEffect } from "react";
import "./App.css";
import { downloadCSV, saveToGoogleSheets } from "./utils/csvUtils";

// SSQ Questions - inline to avoid import issues
const SSQ_QUESTIONS = [
  { id: 1, text: "General discomfort" },
  { id: 2, text: "Fatigue" },
  { id: 3, text: "Headache" },
  { id: 4, text: "Eye strain" },
  { id: 5, text: "Difficulty focusing" },
  { id: 6, text: "Increased salivation" },
  { id: 7, text: "Sweating" },
  { id: 8, text: "Nausea" },
  { id: 9, text: "Difficulty concentrating" },
  { id: 10, text: "Fullness of head" },
  { id: 11, text: "Blurred vision" },
  { id: 12, text: "Dizzy (with eyes open)" },
  { id: 13, text: "Dizzy (with eyes closed)" },
  { id: 14, text: "Vertigo" },
  { id: 15, text: "Stomach awareness" },
  { id: 16, text: "Burping" }
];

const SSQ_SCALE_OPTIONS = [
  { value: 0, label: "None" },
  { value: 1, label: "Slight" },
  { value: 2, label: "Moderate" },
  { value: 3, label: "Severe" }
];

// Toast Component - inline to avoid import issues
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = (type) => {
    switch(type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <span className="toast-icon">{getIcon(type)}</span>
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

// Question Card Component - inline to avoid import issues
const QuestionCard = ({ question, index, value, onChange }) => {
  return (
    <div className="question-item">
      <div className="question-number">Symptom {question.id}</div>
      <div className="question-text">{question.text}</div>
      <div className="scale-container">
        <div className="scale-options">
          {SSQ_SCALE_OPTIONS.map((option) => (
            <div key={option.value} className="scale-item">
              <div className="scale-label">{option.label}</div>
              <input
                type="radio"
                name={`symptom_${question.id}`}
                value={option.value}
                checked={value === String(option.value)}
                onChange={(e) => onChange(index, e.target.value)}
                className="radio-input"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('SSQ App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #2e1a1a, #3e1616)',
          color: '#e0e0e0',
          minHeight: '100vh',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h1 style={{ color: '#f66464' }}>Something went wrong!</h1>
          <p>Please refresh the page and try again.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              background: '#f66464',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main App Component
function App() {
  const [participantID, setParticipantID] = useState("");
  const [condition, setCondition] = useState("");
  const [answers, setAnswers] = useState(Array(SSQ_QUESTIONS.length).fill(""));
  const [toasts, setToasts] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // New states for Google Sheets functionality
  const [saveMethod, setSaveMethod] = useState("csv"); // "csv" or "sheets"
  const [sheetsUrl, setSheetsUrl] = useState("");
  const [sheetName, setSheetName] = useState("SSQ_Data");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debug: Log when component mounts
  useEffect(() => {
    console.log('SSQ App mounted successfully');
    // Hide loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
    }

    // Initialize session tracking
    if (!sessionStorage.getItem('ssqSessionStart')) {
      sessionStorage.setItem('ssqSessionStart', Date.now().toString());
    }
  }, []);

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

  const calculateSSQScores = () => {
    try {
      const weights = {
        nausea: [1, 6, 7, 8, 9, 15, 16],
        oculomotor: [1, 2, 3, 4, 5, 9, 11],
        disorientation: [5, 8, 10, 11, 12, 13, 14]
      };

      const subscaleScores = {
        nausea: 0,
        oculomotor: 0,
        disorientation: 0
      };

      Object.keys(weights).forEach(subscale => {
        weights[subscale].forEach(questionNum => {
          const questionIndex = questionNum - 1;
          const response = parseInt(answers[questionIndex]) || 0;
          subscaleScores[subscale] += response;
        });
      });

      const convertedScores = {
        nausea: subscaleScores.nausea * 9.54,
        oculomotor: subscaleScores.oculomotor * 7.58,
        disorientation: subscaleScores.disorientation * 13.92
      };

      const totalScore = convertedScores.nausea + convertedScores.oculomotor + convertedScores.disorientation;

      return {
        raw: subscaleScores,
        converted: convertedScores,
        total: totalScore
      };
    } catch (error) {
      console.error('Error calculating SSQ scores:', error);
      return {
        raw: { nausea: 0, oculomotor: 0, disorientation: 0 },
        converted: { nausea: 0, oculomotor: 0, disorientation: 0 },
        total: 0
      };
    }
  };

  const handleSubmit = async () => {
    try {
      if (isSubmitted || isSubmitting) {
        showToast('Already submitted! Please wait for reset...', 'info');
        return;
      }

      if (!participantID.trim()) {
        showToast('Please enter a Participant ID', 'error');
        return;
      }

      if (!condition.trim()) {
        showToast('Please enter a Condition', 'error');
        return;
      }

      if (saveMethod === 'sheets' && !sheetsUrl.trim()) {
        showToast('Please enter a Google Sheets URL', 'error');
        return;
      }

      const emptyAnswers = answers.filter(answer => answer === "").length;
      if (emptyAnswers > 0) {
        showToast(`Please complete all questions (${emptyAnswers} remaining)`, 'error');
        return;
      }

      setIsSubmitting(true);
      const ssqScores = calculateSSQScores();

      const csvData = {
        participantID,
        condition,
        questions: SSQ_QUESTIONS.map((question, index) => ({
          questionNumber: question.id,
          symptom: question.text,
          response: parseInt(answers[index]),
          responseLabel: SSQ_SCALE_OPTIONS.find(opt => opt.value === parseInt(answers[index]))?.label || "Unknown"
        })),
        scores: ssqScores,
        timestamp: new Date().toISOString()
      };

      let result;
      if (saveMethod === 'sheets') {
        showToast('Saving to Google Sheets...', 'info');
        result = await saveToGoogleSheets(csvData, sheetsUrl, sheetName);
      } else {
        result = downloadCSV(csvData, `SSQ_${participantID}_${condition}`);
      }

      if (result.success) {
        setIsSubmitted(true);
        showToast(result.message, 'success');

        setTimeout(() => {
          setIsSubmitted(false);
          setIsSubmitting(false);
          setParticipantID("");
          setCondition("");
          setAnswers(Array(SSQ_QUESTIONS.length).fill(""));
          showToast('Form reset - ready for next participant', 'info');
        }, 3000);
      } else {
        setIsSubmitting(false);
        showToast(result.message, 'error');
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setIsSubmitting(false);
      showToast('Error submitting form. Please try again.', 'error');
    }
  };

  const completedQuestions = answers.filter(answer => answer !== "").length;
  const progress = (completedQuestions / SSQ_QUESTIONS.length) * 100;

  return (
    <ErrorBoundary>
      <div className="app">
        <div className="container">
          <header className="header">
            <h1 className="title">SSQ Questionnaire</h1>
            <a
              href="https://github.com/your-username/ssq-questionnaire"
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

          <div className="instructions">
            <div className="instructions-title">Instructions</div>
            <div className="instructions-text">
              Please rate how much each symptom below is affecting you right now.
              Circle one response that best describes your experience at this moment.
              Consider how you feel compared to when you started the session.
            </div>
          </div>

          <div>
            <div className="form-container">
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

              {/* Save Method Selection */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Save Method</label>
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
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Google Sheets URL</label>
                    <input
                      type="url"
                      className="form-input"
                      value={sheetsUrl}
                      onChange={(e) => setSheetsUrl(e.target.value)}
                      placeholder="https://docs.google.com/spreadsheets/d/..."
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sheet Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={sheetName}
                      onChange={(e) => setSheetName(e.target.value)}
                      placeholder="SSQ_Data"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Scrollable Questionnaire Section */}
            <div className="questionnaire-wrapper">
              <div className="progress-container-sticky">
                <div className="progress-label">
                  Progress: {completedQuestions} of {SSQ_QUESTIONS.length} symptoms rated ({Math.round(progress)}%)
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="questionnaire-scroll">
                <div className="question-grid">
                  {SSQ_QUESTIONS.map((question, index) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      index={index}
                      value={answers[index]}
                      onChange={handleChange}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="del">
              <button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : isSubmitted ? 'Submitted' : 'Submit'}
              </button>
            </div>
          </div>

          <footer className="footer">
            © 2025 Mohammad Raihanul Bashar. Developed with ❤️
          </footer>
        </div>

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
      </div>
    </ErrorBoundary>
  );
}

export default App;