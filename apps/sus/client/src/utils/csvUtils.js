// csvUtils_sus.js
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyd7TOW9KSSj7oAu59XnMXDOzNccTrS96XHMa0CnuplEgx5PcL3h3bBUP-WF2Juo6ru/exec';

function enhanceDataWithMetadata(data) {
  const timestamp = new Date().toISOString();
  const date = timestamp.split('T')[0];
  const time = timestamp.split('T')[1].split('.')[0];

  return {
    ...data,
    metadata: {
      submissionDate: date,
      submissionTime: time,
      timestamp,
      sessionDuration: calculateSessionDuration(),
      browser: navigator.userAgent
    }
  };
}

function calculateSessionDuration() {
  const key = 'susSessionStart';
  const start = sessionStorage.getItem(key) || Date.now();
  if (!sessionStorage.getItem(key)) sessionStorage.setItem(key, start);
  const duration = Date.now() - start;
  const m = Math.floor(duration / 60000);
  const s = Math.floor((duration % 60000) / 1000);
  return `${m}m ${s}s`;
}

function convertToCSV(data) {
  const headers = [
    'Participant_ID', 'Condition', 'Question', 'Response',
    'SUS_Score', 'SUS_Grade', 'SUS_Adjective',
    'Submission_Date', 'Submission_Time', 'Timestamp', 'Session_Duration'
  ];

  let csv = headers.join(',') + '\n';

  Object.entries(data.responses).forEach(([index, response], i) => {
    csv += [
      data.participantId,
      data.condition,
      `Q${parseInt(index) + 1}`,
      response,
      data.susScore,
      data.susGrade,
      data.susAdjective,
      data.metadata.submissionDate,
      data.metadata.submissionTime,
      data.metadata.timestamp,
      data.metadata.sessionDuration
    ].join(',') + '\n';
  });

  return csv;
}

export function downloadCSV(data, filenameBase = 'sus_data') {
  const enhanced = enhanceDataWithMetadata(data);
  const csv = convertToCSV(enhanced);
  const blob = new Blob([csv], { type: 'text/csv' });
  const filename = `${filenameBase}_${Date.now()}.csv`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function saveToGoogleSheets(data, sheetUrl, sheetName = 'SUS') {
  try {
    const sheetId = extractGoogleSheetId(sheetUrl);
    const enhanced = enhanceDataWithMetadata(data);

    const headers = [
      'Participant_ID', 'Condition', 'Question', 'Response',
      'SUS_Score', 'SUS_Grade', 'SUS_Adjective',
      'Submission_Date', 'Submission_Time', 'Timestamp', 'Session_Duration'
    ];

    const rows = Object.entries(data.responses).map(([index, response], i) => [
      data.participantId,
      data.condition,
      `Q${parseInt(index) + 1}`,
      response,
      data.susScore,
      data.susGrade,
      data.susAdjective,
      enhanced.metadata.submissionDate,
      enhanced.metadata.submissionTime,
      enhanced.metadata.timestamp,
      enhanced.metadata.sessionDuration
    ]);

    const formData = {
      sheetId,
      sheetName,
      headers: JSON.stringify(headers),
      data: JSON.stringify(rows),
      participantId: data.participantId,
      condition: data.condition
    };

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = GOOGLE_APPS_SCRIPT_URL;
    form.target = 'hidden_iframe';
    form.style.display = 'none';

    Object.keys(formData).forEach(key => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = formData[key];
      form.appendChild(input);
    });

    const iframe = document.createElement('iframe');
    iframe.name = 'hidden_iframe';
    iframe.style.display = 'none';

    document.body.appendChild(iframe);
    document.body.appendChild(form);

    return new Promise(resolve => {
      iframe.onload = () => {
        form.remove();
        iframe.remove();
        resolve({ success: true, message: '✅ Data saved to Google Sheets successfully!' });
      };

      iframe.onerror = () => {
        form.remove();
        iframe.remove();
        resolve({ success: false, message: '❌ Failed to save to Google Sheets.' });
      };

      form.submit();
    });
  } catch (err) {
    console.error('Google Sheets Error:', err);
    return { success: false, message: err.message };
  }
}

function extractGoogleSheetId(url) {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}
