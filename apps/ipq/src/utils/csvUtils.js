// Alternative csvUtils.js - This method completely avoids CORS issues
// Replace your saveToGoogleSheets function with this approach

// Configuration - Replace with your actual Google Apps Script URL
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyd7TOW9KSSj7oAu59XnMXDOzNccTrS96XHMa0CnuplEgx5PcL3h3bBUP-WF2Juo6ru/exec';

// Method 1: Using a hidden iframe (Recommended - No CORS issues)
export async function saveToGoogleSheets(data, sheetUrl, sheetName = 'IPQ') {
  try {
    const sheetId = extractGoogleSheetId(sheetUrl);
    if (!sheetId) {
      throw new Error('Invalid Google Sheets URL format. Please check the URL and try again.');
    }

    const enhancedData = enhanceDataWithMetadata(data);
    const values = convertToSheetsFormat(enhancedData);

    // Create form data
    const formData = new FormData();
    formData.append('sheetId', sheetId);
    formData.append('sheetName', sheetName);
    formData.append('headers', JSON.stringify(values.headers));
    formData.append('data', JSON.stringify(values.rows));
    formData.append('participantId', enhancedData.participantID);
    formData.append('condition', enhancedData.condition);

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
      condition: enhancedData.condition
    };

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
      iframe.onload = () => {
        // Clean up
        document.body.removeChild(form);
        document.body.removeChild(iframe);

        resolve({
          success: true,
          message: `✅ Data successfully saved to '${sheetName}' sheet!`
        });
      };

      // Handle errors
      iframe.onerror = () => {
        document.body.removeChild(form);
        document.body.removeChild(iframe);

        resolve({
          success: false,
          message: 'Failed to save to Google Sheets. Please check your settings.'
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

// Method 2: Direct form submission (Opens in new tab)
export function saveToGoogleSheetsNewTab(data, sheetUrl, sheetName = 'IPQ') {
  try {
    const sheetId = extractGoogleSheetId(sheetUrl);
    if (!sheetId) {
      throw new Error('Invalid Google Sheets URL format.');
    }

    const enhancedData = enhanceDataWithMetadata(data);
    const values = convertToSheetsFormat(enhancedData);

    // Create form
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = GOOGLE_APPS_SCRIPT_URL;
    form.target = '_blank'; // Opens in new tab
    form.style.display = 'none';

    // Add form fields
    const fields = {
      sheetId: sheetId,
      sheetName: sheetName,
      headers: JSON.stringify(values.headers),
      data: JSON.stringify(values.rows),
      participantId: enhancedData.participantID,
      condition: enhancedData.condition
    };

    Object.keys(fields).forEach(key => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = fields[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    return {
      success: true,
      message: `✅ Data submitted to '${sheetName}' sheet! Check the new tab for confirmation.`
    };

  } catch (error) {
    return {
      success: false,
      message: `Failed to save: ${error.message}`
    };
  }
}

// Keep all your existing functions unchanged
function enhanceDataWithMetadata(data) {
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
  const sessionStart = sessionStorage.getItem('ipqSessionStart') || Date.now();
  if (!sessionStorage.getItem('ipqSessionStart')) {
    sessionStorage.setItem('ipqSessionStart', sessionStart);
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

function convertToSheetsFormat(data) {
  const headers = [
    'Participant_ID', 'Condition', 'Question_Number', 'Question_Text',
    'Left_Anchor', 'Right_Anchor', 'Response_Value', 'Submission_Date',
    'Submission_Time', 'Timestamp', 'Session_Duration'
  ];

  const rows = data.questions.map(question => [
    data.participantID,
    data.condition,
    question.questionNumber,
    question.questionText,
    question.leftAnchor,
    question.rightAnchor,
    question.response,
    data.metadata.submissionDate,
    data.metadata.submissionTime,
    data.metadata.timestamp,
    data.metadata.sessionDuration
  ]);

  return { headers, rows };
}

// Keep all your existing CSV functions unchanged
export function downloadCSV(data, baseFilename) {
  const enhancedData = enhanceDataWithMetadata(data);
  const csv = convertToCSV(enhancedData);
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

function convertToCSV(data) {
  const headers = [
    'Participant_ID',
    'Condition',
    'Question_Number',
    'Question_Text',
    'Left_Anchor',
    'Right_Anchor',
    'Response_Value',
    'Submission_Date',
    'Submission_Time',
    'Timestamp',
    'Session_Duration',
  ];

  let csvContent = headers.join(',') + '\n';

  data.questions.forEach(question => {
    const row = [
      `"${sanitize(data.participantID)}"`,
      `"${sanitize(data.condition)}"`,
      question.questionNumber,
      `"${sanitize(question.questionText)}"`,
      `"${sanitize(question.leftAnchor)}"`,
      `"${sanitize(question.rightAnchor)}"`,
      question.response,
      `"${data.metadata.submissionDate}"`,
      `"${data.metadata.submissionTime}"`,
      `"${data.metadata.timestamp}"`,
      `"${data.metadata.sessionDuration}"`
    ];
    csvContent += row.join(',') + '\n';
  });

  return csvContent;
}

function sanitize(value) {
  if (typeof value === 'string') {
    return value.replace(/"/g, '""');
  }
  return value || '';
}