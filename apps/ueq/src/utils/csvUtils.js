// Configuration - Replace with your actual Google Apps Script URL
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyd7TOW9KSSj7oAu59XnMXDOzNccTrS96XHMa0CnuplEgx5PcL3h3bBUP-WF2Juo6ru/exec';

// ============================================================================
// CORE DATA PROCESSING FUNCTIONS
// ============================================================================

function enhanceDataWithMetadata(data) {
    const timestamp = new Date().toISOString();
    const date = timestamp.split('T')[0]; // YYYY-MM-DD
    const time = timestamp.split('T')[1].split('.')[0]; // HH:MM:SS

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
    const sessionStart = sessionStorage.getItem('ueqSessionStart') || Date.now();
    if (!sessionStorage.getItem('ueqSessionStart')) {
        sessionStorage.setItem('ueqSessionStart', sessionStart);
    }

    const duration = Date.now() - parseInt(sessionStart);
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
}

function convertToCSV(data) {
    const headers = [
        'UEQ_Version',
        'Participant_ID',
        'Condition',
        'Question_Number',
        'Question_Left',
        'Question_Right',
        'Response_Value',
        'Submission_Date',
        'Submission_Time',
        'Timestamp',
        'Session_Duration'
    ];

    let csvContent = headers.join(',') + '\n';

    data.questions.forEach(question => {
        const row = [
        `"${sanitize(data.ueqVersion)}"`,
        `"${sanitize(data.participantID)}"`,
        `"${sanitize(data.condition)}"`,
        question.questionNumber,
        `"${sanitize(question.questionLeft)}"`,
        `"${sanitize(question.questionRight)}"`,
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
        return value.replace(/"/g, '""'); // Escape double quotes
    }
    return value || ''; // Handle null/undefined values
}

// ============================================================================
// LOCAL DOWNLOAD FUNCTION
// ============================================================================

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

// ============================================================================
// GOOGLE SHEETS INTEGRATION
// ============================================================================

export async function saveToGoogleSheets(data, sheetUrl, sheetName = 'UEQ') {
    try {
        const sheetId = extractGoogleSheetId(sheetUrl);
        if (!sheetId) {
        throw new Error('Invalid Google Sheets URL format. Please check the URL and try again.');
        }

    const enhancedData = enhanceDataWithMetadata(data);
    const values = convertToSheetsFormat(enhancedData);

    // Create form data for submission
    const formData = {
        sheetId: sheetId,
        sheetName: sheetName,
        headers: JSON.stringify(values.headers),
        data: JSON.stringify(values.rows),
        participantId: enhancedData.participantID,
        condition: enhancedData.condition
    };

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
    Object.keys(formData).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = formData[key];
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
            message: `✅ UEQ data successfully saved to '${sheetName}' sheet!`
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

function extractGoogleSheetId(url) {
    const patterns = [
        /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/,
        /spreadsheets\/d\/([a-zA-Z0-9-_]+)/,
        /^([a-zA-Z0-9-_]+)$/ // Direct ID
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

function convertToSheetsFormat(data) {
    const headers = [
        'UEQ_Version', 'Participant_ID', 'Condition', 'Question_Number',
        'Question_Left', 'Question_Right', 'Response_Value', 'Submission_Date',
        'Submission_Time', 'Timestamp', 'Session_Duration'
    ];

    const rows = data.questions.map(question => [
        data.ueqVersion,
        data.participantID,
        data.condition,
        question.questionNumber,
        question.questionLeft,
        question.questionRight,
        question.response,
        data.metadata.submissionDate,
        data.metadata.submissionTime,
        data.metadata.timestamp,
        data.metadata.sessionDuration
    ]);

    return { headers, rows };
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export function validateGoogleSheetUrl(url) {
    if (!url || !url.trim()) {
        return { valid: false, error: 'Google Sheets URL is required' };
    }

    const sheetId = extractGoogleSheetId(url);
    if (!sheetId) {
        return {
        valid: false,
        error: 'Invalid Google Sheets URL format. Please copy the URL from your browser address bar.'
        };
    }

    return { valid: true, sheetId };
}

export function validateSheetName(name) {
    if (!name || !name.trim()) {
        return { valid: false, error: 'Sheet name is required' };
    }

  // Check for invalid characters that Google Sheets doesn't allow
    const invalidChars = /[[\]:*?/\\]/;
    if (invalidChars.test(name)) {
        return {
        valid: false,
        error: 'Sheet name contains invalid characters. Avoid: [ ] : * ? / \\'
        };
    }

    if (name.length > 100) {
        return {
        valid: false,
        error: 'Sheet name must be 100 characters or less'
        };
    }

    return { valid: true };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function getQuestionSummary(questions, answers) {
    const completed = answers.filter(answer => answer !== "").length;
    const total = questions.length;
    const percentage = Math.round((completed / total) * 100);

    return {
        completed,
        total,
        percentage,
        remaining: total - completed,
        isComplete: completed === total
    };
}

export function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString(),
        iso: date.toISOString()
    };
}

// ============================================================================
// TEST FUNCTION
// ============================================================================

export async function testGoogleSheetsConnection(sheetUrl, sheetName = 'UEQ_Test') {
    try {
        const testData = {
        participantID: 'TEST_USER',
        condition: 'Connection_Test',
        ueqVersion: 'Short',
        questions: [{
            questionNumber: 1,
            questionLeft: 'annoying',
            questionRight: 'enjoyable',
            response: 2
        }],
        timestamp: new Date().toISOString()
        };

    const result = await saveToGoogleSheets(testData, sheetUrl, sheetName);
    return result;
    } catch (error) {
        return {
        success: false,
        message: `Connection test failed: ${error.message}`
        };
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    downloadCSV,
    saveToGoogleSheets,
    validateGoogleSheetUrl,
    validateSheetName,
    getQuestionSummary,
    formatTimestamp,
    testGoogleSheetsConnection,
    enhanceDataWithMetadata
};