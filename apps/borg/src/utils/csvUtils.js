// Configuration - Replace with your actual Google Apps Script URL
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
            timestamp: timestamp,
            browserInfo: getBrowserInfo(),
            sessionDuration: calculateSessionDuration()
        }
    };
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

function getBrowserInfo() {
    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
    };
}

function calculateSessionDuration() {
    const sessionStart = sessionStorage.getItem('borgSessionStart') || Date.now();
    if (!sessionStorage.getItem('borgSessionStart')) {
        sessionStorage.setItem('borgSessionStart', sessionStart);
    }

    const duration = Date.now() - parseInt(sessionStart);
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
}

function convertToCSV(data) {
    const headers = [
        'Participant_ID',
        'Condition',
        'Time',
        'Level',
        'Submission_Date',
        'Submission_Time',
        'Timestamp',
        'Session_Duration'
    ];

    let csvContent = headers.join(',') + '\n';

    data.exertions.forEach(entry => {
        const row = [
            `"${sanitize(data.participantID)}"`,
            `"${sanitize(data.condition)}"`,
            entry.time,
            entry.level,
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

export async function saveToGoogleSheets(data, sheetUrl, sheetName = 'Borg_CR10') {
    try {
        const sheetId = extractGoogleSheetId(sheetUrl);
        if (!sheetId) {
            throw new Error('Invalid Google Sheets URL format. Please check the URL and try again.');
        }

        const enhancedData = enhanceDataWithMetadata(data);
        const values = convertToSheetsFormat(enhancedData);

        const formData = {
            sheetId: sheetId,
            sheetName: sheetName,
            headers: JSON.stringify(values.headers),
            data: JSON.stringify(values.rows),
            participantId: enhancedData.participantID,
            condition: enhancedData.condition
        };

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.name = 'hidden_iframe';
        document.body.appendChild(iframe);

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

        document.body.appendChild(form);

        return new Promise((resolve) => {
            iframe.onload = () => {
                document.body.removeChild(form);
                document.body.removeChild(iframe);
                resolve({ success: true, message: `✅ Data saved to '${sheetName}' successfully!` });
            };

            iframe.onerror = () => {
                document.body.removeChild(form);
                document.body.removeChild(iframe);
                resolve({ success: false, message: '❌ Failed to save to Google Sheets.' });
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

function extractGoogleSheetId(url) {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
}

function convertToSheetsFormat(data) {
    const headers = [
        'Participant_ID',
        'Condition',
        'Time',
        'Level',
        'Submission_Date',
        'Submission_Time',
        'Timestamp',
        'Session_Duration'
    ];

    const rows = data.exertions.map(entry => [
        data.participantID,
        data.condition,
        entry.time,
        entry.level,
        data.metadata.submissionDate,
        data.metadata.submissionTime,
        data.metadata.timestamp,
        data.metadata.sessionDuration
    ]);

    return { headers, rows };
}
