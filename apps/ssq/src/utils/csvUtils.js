// SSQ-specific csvUtils.js - Handles both local CSV and Google Sheets saving

// Configuration - Replace with your actual Google Apps Script URL
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyd7TOW9KSSj7oAu59XnMXDOzNccTrS96XHMa0CnuplEgx5PcL3h3bBUP-WF2Juo6ru/exec';

// Method 1: Save to Google Sheets using hidden iframe (Recommended - No CORS issues)
export async function saveToGoogleSheets(data, sheetUrl, sheetName = 'SSQ_Data') {
  try {
    const sheetId = extractGoogleSheetId(sheetUrl);
    if (!sheetId) {
      throw new Error('Invalid Google Sheets URL format. Please check the URL and try again.');
    }

    const enhancedData = enhanceSSQDataWithMetadata(data);
    const values = convertSSQToSheetsFormat(enhancedData);

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
      summaryHeaders: JSON.stringify(values.summaryHeaders),
      summaryData: JSON.stringify(values.summaryRows),
      participantId: enhancedData.participantID,
      condition: enhancedData.condition,
      dataType: 'SSQ'
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
          message: `✅ SSQ data successfully saved to '${sheetName}' sheet!`
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

// Method 2: Direct form submission (Opens in new tab)
export function saveToGoogleSheetsNewTab(data, sheetUrl, sheetName = 'SSQ_Data') {
  try {
    const sheetId = extractGoogleSheetId(sheetUrl);
    if (!sheetId) {
      throw new Error('Invalid Google Sheets URL format.');
    }

    const enhancedData = enhanceSSQDataWithMetadata(data);
    const values = convertSSQToSheetsFormat(enhancedData);

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
      summaryHeaders: JSON.stringify(values.summaryHeaders),
      summaryData: JSON.stringify(values.summaryRows),
      participantId: enhancedData.participantID,
      condition: enhancedData.condition,
      dataType: 'SSQ'
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
      message: `✅ SSQ data submitted to '${sheetName}' sheet! Check the new tab for confirmation.`
    };

  } catch (error) {
    return {
      success: false,
      message: `Failed to save: ${error.message}`
    };
  }
}

// Enhanced SSQ data with metadata
function enhanceSSQDataWithMetadata(data) {
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
  const sessionStart = sessionStorage.getItem('ssqSessionStart') || Date.now();
  if (!sessionStorage.getItem('ssqSessionStart')) {
    sessionStorage.setItem('ssqSessionStart', sessionStart);
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

// Convert SSQ data to Google Sheets format
function convertSSQToSheetsFormat(data) {
  // Individual responses headers
  const headers = [
    'Participant_ID', 'Condition', 'Symptom_Number', 'Symptom_Name',
    'Response_Value', 'Response_Label', 'Submission_Date',
    'Submission_Time', 'Timestamp', 'Session_Duration'
  ];

  // Individual responses rows
  const rows = data.questions.map(question => [
    data.participantID,
    data.condition,
    question.questionNumber,
    question.symptom,
    question.response,
    question.responseLabel,
    data.metadata.submissionDate,
    data.metadata.submissionTime,
    data.metadata.timestamp,
    data.metadata.sessionDuration
  ]);

  // Summary scores headers
  const summaryHeaders = [
    'Participant_ID', 'Condition', 'Total_Score', 'Nausea_Score',
    'Oculomotor_Score', 'Disorientation_Score', 'Nausea_Raw',
    'Oculomotor_Raw', 'Disorientation_Raw', 'Submission_Date',
    'Submission_Time', 'Timestamp', 'Session_Duration'
  ];

  // Summary scores rows
  const summaryRows = [[
    data.participantID,
    data.condition,
    data.scores.total.toFixed(2),
    data.scores.converted.nausea.toFixed(2),
    data.scores.converted.oculomotor.toFixed(2),
    data.scores.converted.disorientation.toFixed(2),
    data.scores.raw.nausea,
    data.scores.raw.oculomotor,
    data.scores.raw.disorientation,
    data.metadata.submissionDate,
    data.metadata.submissionTime,
    data.metadata.timestamp,
    data.metadata.sessionDuration
  ]];

  return { headers, rows, summaryHeaders, summaryRows };
}

// Local CSV download function
export function downloadCSV(data, baseFilename) {
  try {
    const enhancedData = enhanceSSQDataWithMetadata(data);
    const csv = convertSSQToCSV(enhancedData);
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
      message: `✅ SSQ data downloaded as ${filename}`
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

// Convert SSQ data to CSV format
function convertSSQToCSV(data) {
  let csvContent = "=== SSQ SUMMARY SCORES ===\n";
  csvContent += "Participant_ID,Condition,Total_Score,Nausea_Score,Oculomotor_Score,Disorientation_Score,Nausea_Raw,Oculomotor_Raw,Disorientation_Raw,Submission_Date,Submission_Time,Session_Duration\n";

  csvContent += [
    `"${sanitize(data.participantID)}"`,
    `"${sanitize(data.condition)}"`,
    data.scores.total.toFixed(2),
    data.scores.converted.nausea.toFixed(2),
    data.scores.converted.oculomotor.toFixed(2),
    data.scores.converted.disorientation.toFixed(2),
    data.scores.raw.nausea,
    data.scores.raw.oculomotor,
    data.scores.raw.disorientation,
    `"${data.metadata.submissionDate}"`,
    `"${data.metadata.submissionTime}"`,
    `"${data.metadata.sessionDuration}"`
  ].join(',') + '\n\n';

  csvContent += "=== INDIVIDUAL SYMPTOM RESPONSES ===\n";
  csvContent += "Participant_ID,Condition,Symptom_Number,Symptom_Name,Response_Value,Response_Label,Submission_Date,Submission_Time,Session_Duration\n";

  data.questions.forEach(question => {
    const row = [
      `"${sanitize(data.participantID)}"`,
      `"${sanitize(data.condition)}"`,
      question.questionNumber,
      `"${sanitize(question.symptom)}"`,
      question.response,
      `"${sanitize(question.responseLabel)}"`,
      `"${data.metadata.submissionDate}"`,
      `"${data.metadata.submissionTime}"`,
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