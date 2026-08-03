// NASA TLX-specific csvUtils.js - Handles both local CSV and Google Sheets saving

// Configuration - Replace with your actual Google Apps Script URL
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyd7TOW9KSSj7oAu59XnMXDOzNccTrS96XHMa0CnuplEgx5PcL3h3bBUP-WF2Juo6ru/exec';

// Method 1: Save to Google Sheets using hidden iframe (Recommended - No CORS issues)
export async function saveToGoogleSheets(data, sheetUrl, sheetName = 'NASA_TLX_Data') {
  try {
    const sheetId = extractGoogleSheetId(sheetUrl);
    if (!sheetId) {
      throw new Error('Invalid Google Sheets URL format. Please check the URL and try again.');
    }

    const enhancedData = enhanceNASATLXDataWithMetadata(data);
    const values = convertNASATLXToSheetsFormat(enhancedData);

    // Create hidden iframe for submission
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.name = 'hidden_iframe';
    document.body.appendChild(iframe);

    // Create form
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = GOOGLE_APPS_SCRIPT_URL;
    form.target = 'hidden_iframe';
    form.style.display = 'none';

    // Add form fields
    const fields = {
      sheetId: sheetId,
      sheetName: sheetName,
      headers: JSON.stringify(values.headers),
      data: JSON.stringify(values.rows),
      participantId: enhancedData.participantID,
      condition: enhancedData.condition,
      dataType: 'NASA_TLX',
      mode: enhancedData.mode || 'raw'
    };

    // Add weighted-specific data if available
    if (enhancedData.weights) {
      fields.weightsHeaders = JSON.stringify(values.weightsHeaders || []);
      fields.weightsData = JSON.stringify(values.weightsRows || []);
    }

    Object.keys(fields).forEach(key => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = fields[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);

    // Submit form and return promise
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        // Clean up on timeout
        document.body.removeChild(form);
        document.body.removeChild(iframe);
        resolve({
          success: true,
          message: `✅ Data successfully submitted to '${sheetName}' sheet!`
        });
      }, 5000); // 5 second timeout

      iframe.onload = () => {
        clearTimeout(timeoutId);
        // Clean up
        document.body.removeChild(form);
        document.body.removeChild(iframe);

        resolve({
          success: true,
          message: `✅ NASA TLX data successfully saved to '${sheetName}' sheet!`
        });
      };

      // Handle errors
      iframe.onerror = () => {
        clearTimeout(timeoutId);
        document.body.removeChild(form);
        document.body.removeChild(iframe);

        resolve({
          success: false,
          message: 'Failed to save to Google Sheets. Please check your settings and try again.'
        });
      };

      form.submit();
    });

  } catch (error) {
    console.error('Google Sheets save error:', error);
    return {
      success: false,
      message: `Failed to save to Google Sheets: ${error.message}`
    };
  }
}

// Enhanced NASA TLX data with metadata
function enhanceNASATLXDataWithMetadata(data) {
  const timestamp = new Date().toISOString();
  const date = timestamp.split('T')[0];
  const time = timestamp.split('T')[1].split('.')[0];

  return {
    ...data,
    metadata: {
      submissionDate: date,
      submissionTime: time,
      timestamp: timestamp,
      browserInfo: getBrowserInfo(),
      sessionDuration: calculateSessionDuration()
    }
  };
}

function calculateSessionDuration() {
  const sessionStart = sessionStorage.getItem('nasaTlxSessionStart') || Date.now();
  if (!sessionStorage.getItem('nasaTlxSessionStart')) {
    sessionStorage.setItem('nasaTlxSessionStart', sessionStart);
  }

  const duration = Date.now() - parseInt(sessionStart);
  const minutes = Math.floor(duration / 60000);
  const seconds = Math.floor((duration % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

function getBrowserInfo() {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
  };
}

function extractGoogleSheetId(url) {
  const patterns = [
    /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/,
    /spreadsheets\/d\/([a-zA-Z0-9-_]+)/,
    /^([a-zA-Z0-9-_]+)$/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Convert NASA TLX data to Google Sheets format
function convertNASATLXToSheetsFormat(data) {
  // Main scores headers
  const headers = [
    'Participant_ID', 'Condition', 'Mode', 'Dimension', 'Score',
    'Submission_Date', 'Submission_Time', 'Timestamp', 'Session_Duration'
  ];

  // Main scores rows
  const rows = data.scores.map(scoreData => [
    data.participantID,
    data.condition,
    data.mode || 'raw',
    scoreData.dimension,
    scoreData.score,
    data.metadata.submissionDate,
    data.metadata.submissionTime,
    data.metadata.timestamp,
    data.metadata.sessionDuration
  ]);

  const result = { headers, rows };

  // Add weights data if available (for weighted TLX)
  if (data.weights) {
    const weightsHeaders = [
      'Participant_ID', 'Condition', 'Dimension', 'Weight',
      'Submission_Date', 'Submission_Time', 'Timestamp', 'Session_Duration'
    ];

    const weightsRows = Object.entries(data.weights).map(([dimension, weight]) => [
      data.participantID,
      data.condition,
      dimension,
      weight,
      data.metadata.submissionDate,
      data.metadata.submissionTime,
      data.metadata.timestamp,
      data.metadata.sessionDuration
    ]);

    result.weightsHeaders = weightsHeaders;
    result.weightsRows = weightsRows;
  }

  return result;
}

// Local CSV download function
export function downloadCSV(data, baseFilename) {
  try {
    const enhancedData = enhanceNASATLXDataWithMetadata(data);
    const csv = convertNASATLXToCSV(enhancedData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    const filename = generateEnhancedFilename(baseFilename);

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return {
      success: true,
      message: `✅ NASA TLX data downloaded as ${filename}`
    };
  } catch (error) {
    console.error('CSV download error:', error);
    return {
      success: false,
      message: `Failed to download CSV: ${error.message}`
    };
  }
}

function generateEnhancedFilename(baseFilename) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const sanitizedFilename = baseFilename.replace(/[^a-zA-Z0-9]/g, '_');
  const sessionId = generateSessionId();
  return `${sanitizedFilename}_${timestamp}_${sessionId}.csv`;
}

function generateSessionId() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Convert NASA TLX data to CSV format
function convertNASATLXToCSV(data) {
  let csvContent = "=== NASA TLX SCORES ===\n";
  csvContent += "Participant_ID,Condition,Mode,Dimension,Score,Submission_Date,Submission_Time,Session_Duration\n";

  data.scores.forEach(scoreData => {
    const row = [
      `"${sanitize(data.participantID)}"`,
      `"${sanitize(data.condition)}"`,
      `"${sanitize(data.mode || 'raw')}"`,
      `"${sanitize(scoreData.dimension)}"`,
      scoreData.score,
      `"${data.metadata.submissionDate}"`,
      `"${data.metadata.submissionTime}"`,
      `"${data.metadata.sessionDuration}"`
    ];
    csvContent += row.join(',') + '\n';
  });

  // Add weights section if available (for weighted TLX)
  if (data.weights) {
    csvContent += "\n=== DIMENSION WEIGHTS ===\n";
    csvContent += "Participant_ID,Condition,Dimension,Weight,Submission_Date,Submission_Time,Session_Duration\n";

    Object.entries(data.weights).forEach(([dimension, weight]) => {
      const row = [
        `"${sanitize(data.participantID)}"`,
        `"${sanitize(data.condition)}"`,
        `"${sanitize(dimension)}"`,
        weight,
        `"${data.metadata.submissionDate}"`,
        `"${data.metadata.submissionTime}"`,
        `"${data.metadata.sessionDuration}"`
      ];
      csvContent += row.join(',') + '\n';
    });
  }

  return csvContent;
}

function sanitize(value) {
  if (typeof value === 'string') {
    return value.replace(/"/g, '""');
  }
  return value || '';
}

// Legacy function for backward compatibility (used by existing code)
export function makeCsv(rows) {
  const header = ["Participant ID", "Condition", "Type", "Score"];
  return [header, ...rows].map(r => r.join(",")).join("\r\n");
}