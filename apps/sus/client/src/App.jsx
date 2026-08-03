import { useState, useEffect, useRef } from 'react';
import QuestionList from './QuestionList.jsx';
import ThemeSwitch from './ThemeSwitch.jsx';
import { useToast, ToastContainer } from './Toast';
import { downloadCSV, saveToGoogleSheets } from './utils/csvUtils';


const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function App() {
  const [participantId, setParticipantId]             = useState('');
  const [condition, setCondition]                     = useState('');
  const [responses, setResponses]                     = useState({});
  const [submitted,  setSubmitted]                    = useState(false);
  const [dark, setDark]                               = useState(true);
  const [answered, setAnswered]                       = useState(0);
  // const [selectedSaveOption, setSelectedSaveOption]   = useState('local');
  const [selectedSaveOption, setSelectedSaveOption]   = useState('googlesheets');
  const [googleSheetUrl, setGoogleSheetUrl]           = useState('');
  const [sheetName, setSheetName]                     = useState('SUS');
  const sheetUrlRef                                   = useRef(null);

  useEffect(() => {
  const savedSheetUrl = localStorage.getItem('sus_googleSheetUrl');
  const savedSheetName = localStorage.getItem('sus_sheetName');
  const savedOption = localStorage.getItem('sus_saveOption');

  if (savedSheetUrl) setGoogleSheetUrl(savedSheetUrl);
  if (savedSheetName) setSheetName(savedSheetName);
  if (savedOption) setSelectedSaveOption(savedOption);
}, []);

useEffect(() => {
  if (selectedSaveOption === 'googlesheets') {
    setTimeout(() => {
      sheetUrlRef.current?.focus();
    }, 0);
  }
}, [selectedSaveOption]);



  // Toast system
  const { toasts, showError, showSuccess, removeToast } = useToast();

  const questions = [
    'I think that I would like to use this system frequently.',
    'I found the system unnecessarily complex.',
    'I thought the system was easy to use.',
    'I think that I would need the support of a technical person to be able to use this system.',
    'I found the various functions in this system were well-integrated.',
    'I thought there was too much inconsistency in this system.',
    'I would imagine that most people would learn to use this system very quickly.',
    'I found the system very cumbersome (awkward) to use.',
    'I felt very confident using the system.',
    'I needed to learn a lot of things before I could get going with this system.',
  ];

  /* ---------- SUS Score Calculation ---------- */
  const calculateSUSScore = (responses) => {
    let totalScore = 0;

    for (let i = 0; i < 10; i++) {
      const response = responses[i];
      if (response === null || response === undefined) continue;

      // Convert response to number (assuming 1-5 scale)
      const value = parseInt(response);

      // SUS scoring formula
      if ((i + 1) % 2 === 1) {
        // Odd questions (1, 3, 5, 7, 9): score = response - 1
        totalScore += value - 1;
      } else {
        // Even questions (2, 4, 6, 8, 10): score = 5 - response
        totalScore += 5 - value;
      }
    }

    // Multiply by 2.5 to get final SUS score (0-100)
    return totalScore * 2.5;
  };

  const getSUSGrade = (score) => {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'A-';
    if (score >= 75) return 'B+';
    if (score >= 70) return 'B';
    if (score >= 65) return 'B-';
    if (score >= 60) return 'C+';
    if (score >= 55) return 'C';
    if (score >= 50) return 'C-';
    if (score >= 45) return 'D';
    if (score >= 40) return 'D-';
    return 'F';
  };

  const getSUSAdjective = (score) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'OK';
    if (score >= 25) return 'Poor';
    return 'Awful';
  };

  /* ---------- helpers ---------- */
  // whenever a radio changes …
  const handleChange = (qIdx, value) => {
    setResponses(prev => {
      const next = { ...prev, [qIdx]: value };
      setAnswered(Object.keys(next).length);        // update counter
      return next;
    });
  };

  const handleSubmit = async () => {
  if (!participantId.trim() || !condition.trim()) {
    showError('Please fill Participant ID and Condition');
    return;
  }

  const answeredQuestions = Object.keys(responses).filter(key => responses[key] != null).length;
  if (answeredQuestions !== 10) {
    showError(`Please answer all questions. You have answered ${answeredQuestions} out of 10.`);
    return;
  }

  const susScore = calculateSUSScore(responses);
  const susGrade = getSUSGrade(susScore);
  const susAdjective = getSUSAdjective(susScore);

  const susData = {
    participantId,
    condition,
    responses,
    susScore,
    susGrade,
    susAdjective
  };

  try {
    let result;

    if (selectedSaveOption === 'local') {
      downloadCSV(susData, `${participantId}_${condition}_SUS`);
      result = { success: true, message: 'CSV downloaded locally!' };
    } else {
      if (!googleSheetUrl.trim()) {
        showError('Google Sheet URL is required');
        return;
      }

      result = await saveToGoogleSheets(susData, googleSheetUrl, sheetName);
    }

    if (result.success) {
      setSubmitted(true);
      showSuccess(result.message);
    } else {
      showError(result.message);
    }
  } catch (err) {
    console.error('Submit Error:', err);
    showError('Something went wrong while saving.');
  }
};


  /* ---------- UI ---------- */
  if (submitted) {
    return (
      <>
        <div className={dark ? 'theme-dark' : 'theme-light'}>
          <main className="card thanks">
            <h2>✅  Thank you!</h2>
            <p>Your responses have been recorded.</p>
            <div className="final-score">
              <h3>Your SUS Score</h3>
              <div className="score-display">
                <span className="score-number">{calculateSUSScore(responses)}</span>
                <span className="score-grade">Grade: {getSUSGrade(calculateSUSScore(responses))}</span>
                <span className="score-adjective">{getSUSAdjective(calculateSUSScore(responses))}</span>
              </div>
            </div>
          </main>
        </div>
        {/* Toast notifications for thank you page */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </>
    );
  }

  return (
    <>
      <div className={dark ? 'theme-dark' : 'theme-light'}>
        <main className="card">
          {/* STICKY HEADER SECTION */}
          <div className="header-sticky">
            {/* TITLE + GITHUB */}
            <header className="app-header">
              <h1>System Usability Scale (SUS)</h1>
              <div className="header-controls">
                <ThemeSwitch dark={dark} setDark={setDark} />
                <a
                  href="https://github.com/mbraihan/sus-web-app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn github-btn"
                  aria-label="GitHub repository"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="32"
                    height="32"
                    fill="#0092E4"
                    aria-hidden="true"
                  >
                    <path d="M12 .5C5.5.5.5 5.5.5 12a11.5 11.5 0 008 11c.5.1.7-.2.7-.5v-2.2c-3.3.7-4-1.4-4-1.4a3.2 3.2 0 00-1.3-1.7c-1-.7 0-.7 0-.7a2.6 2.6 0 011.9 1.3 2.6 2.6 0 003.5 1 2.6 2.6 0 01.7-1.6c-2.6-.3-5.3-1.3-5.3-5.7a4.4 4.4 0 011.2-3 4.1 4.1 0 01.1-3s1-.3 3.3 1.3a11.4 11.4 0 016 0C16.9 6.2 18 6.5 18 6.5a4.1 4.1 0 01.1 3 4.4 4.4 0 011.2 3c0 4.4-2.7 5.3-5.3 5.6a3 3 0 01.9 2.4v3.6c0 .3.2.6.7.5a11.5 11.5 0 008-11C23.5 5.5 18.5.5 12 .5z" />
                  </svg>
                </a>
              </div>
            </header>

            {/* PARTICIPANT / CONDITION */}
            <div className="row">
              <div className="field">
                <label>Participant ID : </label>
                <input
                  value={participantId}
                  onChange={e => setParticipantId(e.target.value)}
                  placeholder='e.g., P01/P02'
                />
              </div>
              <div className="field">
                <label>Condition : </label>
                <input
                  value={condition}
                  onChange={e => setCondition(e.target.value)}
                  placeholder='e.g., With/Without'
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
                        //{/* onChange={(e) => setSelectedSaveOption(e.target.value)} */}
                        onChange={(e) => {
                            setSelectedSaveOption(e.target.value);
                            localStorage.setItem('sus_saveOption', e.target.value);
                        }}
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
                        //{/* onChange={(e) => setSelectedSaveOption(e.target.value)} */}
                        onChange={(e) => {
                          setSelectedSaveOption(e.target.value);
                          localStorage.setItem('sus_saveOption', e.target.value);
                        }}
                      />
                      <div className="save-option-content">
                        <div className="save-option-title">📊 Google Sheets</div>
                        <div className="save-option-desc">Save to Google Sheets</div>
                      </div>
                    </label>
                  </div>

                </div>

            <div className="row">

              {selectedSaveOption === 'googlesheets' && (
                <>

                  <div className="field">
                    <label>Sheet Name:</label>
                    <input
                      type="text"
                      value={sheetName}
                      onChange={e => 
                        {setSheetName(e.target.value);
                        localStorage.setItem('sus_sheetName', e.target.value);
                        }}
                      placeholder="SUS"
                    />
                    {/* <div className="form-hint">
                      💡 Will auto-create if it doesn't exist
                    </div> */}
                  </div>
                  <div className="field">
                    <label>Sheet URL:</label>
                    <input
                      type="text"
                      ref={sheetUrlRef}
                      value={googleSheetUrl}
                      onChange={e => 
                        {
                          setGoogleSheetUrl(e.target.value)
                          localStorage.setItem('sus_googleSheetUrl', e.target.value);
                        }}
                        placeholder="https://docs.google.com/spreadsheets/d/..."
                    />
                      {/* <div className="form-hint">
                      📋 Paste full Google Sheets URL
                    </div> */}
                  </div>
                </>
              )}
            </div>

            {/* ENHANCED PROGRESS BAR */}
            <div className="progress-wrapper">
              <div className="progress-header">
                <span className="progress-label">Progress</span>
                <span className="progress-text">{answered} / 10 answered</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-bar"
                  style={{ width: `${answered * 10}%` }}
                />
                <div className="progress-glow" style={{ width: `${answered * 10}%` }} />
              </div>
              <div className="progress-percentage">{Math.round(answered * 10)}%</div>
            </div>
          </div>

          {/* SCROLLABLE QUESTIONS SECTION */}
          <div className="questions-container">
            <QuestionList
              questions={questions}
              onChange={handleChange}
              selectedValues={responses}
            />


            <div className="del">
                <button onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        </main>

        <footer className="footer">© 2025 Mohammad Raihanul Bashar — Developed with ❤️</footer>
      </div>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
