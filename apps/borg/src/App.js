import React, { useState, useEffect } from 'react';
import './App.css';
import { downloadCSV, saveToGoogleSheets } from './utils/csvUtils';

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

const App = () => {
  const [participantID, setParticipantID] = useState('');
  const [condition, setCondition] = useState('');
  const [exertions, setExertions] = useState({ Before: '', During: '', After: '' });
  const [isLightMode, setIsLightMode] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSaveOption, setSelectedSaveOption] = useState('local');
  const [googleSheetUrl, setGoogleSheetUrl] = useState("");
  const [sheetName, setSheetName] = useState("Borg_CR10");

  useEffect(() => {
    document.body.classList.toggle('light', isLightMode);
  }, [isLightMode]);

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleChange = (time, value) => {
    setExertions({ ...exertions, [time]: value });
  };

  const validateForm = () => {
    if (!participantID.trim()) {
      showToast('Please enter a Participant ID', 'error');
      return false;
    }

    if (!condition.trim()) {
      showToast('Please enter a Condition', 'error');
      return false;
    }

    const timePoints = ['Before', 'During', 'After'];
    const missingRatings = timePoints.filter(time => exertions[time] === '');

    if (missingRatings.length > 0) {
      showToast(`Please complete all exertion ratings (${missingRatings.join(', ')} missing)`, 'error');
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      showToast('Already submitting! Please wait...', 'info');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Prepare data for Borg CR-10
    const borgData = {
      participantID,
      condition,
      exertions: [
        { time: 'Before', level: parseInt(exertions.Before) },
        { time: 'During', level: parseInt(exertions.During) },
        { time: 'After', level: parseInt(exertions.After) }
      ],
      timestamp: new Date().toISOString()
    };

    try {
      let result;

      switch (selectedSaveOption) {
        case 'local':
          downloadCSV(borgData, `${participantID}_${condition}_borg`);
          result = { success: true, message: '✨ Borg CR-10 data downloaded successfully!' };
          break;

        case 'googlesheets':
          showToast('Saving to Google Sheets...', 'info');
          result = await saveToGoogleSheets(borgData, googleSheetUrl, sheetName);
          break;

        default:
          result = { success: false, message: 'Invalid save option selected' };
      }

      if (result.success) {
        showToast(result.message, 'success');

        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSubmitting(false);
          setParticipantID('');
          setCondition('');
          setExertions({ Before: '', During: '', After: '' });
          if (selectedSaveOption === 'googlesheets') {
            setGoogleSheetUrl("");
            setSheetName("Borg_CR10");
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

  // Calculate progress based on completed fields
  const getProgress = () => {
    let completedFields = 0;
    const totalFields = 5; // ParticipantID, Condition, Before, During, After

    if (participantID.trim()) completedFields++;
    if (condition.trim()) completedFields++;
    if (exertions.Before !== '') completedFields++;
    if (exertions.During !== '') completedFields++;
    if (exertions.After !== '') completedFields++;

    return (completedFields / totalFields) * 100;
  };

  const progress = getProgress();
  const completedFields = Math.round((progress / 100) * 5);

  const options = [
    '0 - Nothing at all', '1 - Very Weak', '2 - Weak', '3 - Moderate', '4 - Somewhat strong',
    '5 - Strong', '6 -', '7 - Very Strong', '8 -', '9 -', '10 - Extremely strong'
  ];

  return (
    <div className="container">
      <div className="top-bar">
        <h1>Borg CR-10 Scale</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label className="ui-switch">
            <input type="checkbox" checked={isLightMode} onChange={() => setIsLightMode(!isLightMode)} />
            <div className="slider">
              <div className="circle"></div>
            </div>
          </label>
          <a className="repo-link" href="https://github.com/mbraihan/borg-cr10-app" target="_blank" rel="noopener noreferrer">
            <div className="github-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .5C5.5.5.5 5.5.5 12a11.5 11.5 0 008 11c.5.1.7-.2.7-.5v-2.2c-3.3.7-4-1.4-4-1.4a3.2 3.2 0 00-1.3-1.7c-1-.7 0-.7 0-.7a2.6 2.6 0 011.9 1.3 2.6 2.6 0 003.5 1 2.6 2.6 0 01.7-1.6c-2.6-.3-5.3-1.3-5.3-5.7a4.4 4.4 0 011.2-3 4.1 4.1 0 01.1-3s1-.3 3.3 1.3a11.4 11.4 0 016 0C16.9 6.2 18 6.5 18 6.5a4.1 4.1 0 01.1 3 4.4 4.4 0 011.2 3c0 4.4-2.7 5.3-5.3 5.6a3 3 0 01.9 2.4v3.6c0 .3.2.6.7.5a11.5 11.5 0 008-11C23.5 5.5 18.5.5 12 .5z" />
              </svg>
            </div>
          </a>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="row-group">
            <div className="field">
              <label>Participant ID</label>
              <input
                type="text"
                value={participantID}
                onChange={(e) => setParticipantID(e.target.value)}
                required
                placeholder="e.g., P01 / P02"
              />
            </div>
            <div className="field">
              <label>Condition</label>
              <input
                type="text"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                required
                placeholder="e.g., With / Without"
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
                  <div className="field">
                    <label>Sheet Name</label>
                    <input
                      type="text"
                      value={sheetName}
                      onChange={(e) => setSheetName(e.target.value)}
                      placeholder="Borg_CR10"
                    />
                    <div className="form-hint">
                      💡 This sheet will be created automatically if it doesn't exist
                    </div>
                  </div>
                </div>

                <div className="field">
                  <label>Google Sheets URL</label>
                  <input
                    type="url"
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

          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-label">
              Progress: {completedFields} of 5 fields completed ({Math.round(progress)}%)
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="scale-group">
          <fieldset className="input-group">
            <legend>How would you rate your current level of exertion?</legend>
            {options.map((label, index) => (
              <label key={`before-${index}`} className="radio-option">
                <input
                  type="radio"
                  name="before"
                  value={index}
                  checked={exertions.Before === index.toString()}
                  onChange={(e) => handleChange('Before', e.target.value)}
                  required
                />
                {label}
              </label>
            ))}
          </fieldset>

          <fieldset className="input-group">
            <legend>How would you rate your level of exertion during the experiment?</legend>
            {options.map((label, index) => (
              <label key={`during-${index}`} className="radio-option">
                <input
                  type="radio"
                  name="during"
                  value={index}
                  checked={exertions.During === index.toString()}
                  onChange={(e) => handleChange('During', e.target.value)}
                  required
                />
                {label}
              </label>
            ))}
          </fieldset>

          <fieldset className="input-group">
            <legend>How would you rate your level of exertion now after the experiment?</legend>
            {options.map((label, index) => (
              <label key={`after-${index}`} className="radio-option">
                <input
                  type="radio"
                  name="after"
                  value={index}
                  checked={exertions.After === index.toString()}
                  onChange={(e) => handleChange('After', e.target.value)}
                  required
                />
                {label}
              </label>
            ))}
          </fieldset>
        </div>

        <div className="del">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>

      <footer>
        © 2025 Mohammad Raihanul Bashar — Developed with ❤️
      </footer>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default App;