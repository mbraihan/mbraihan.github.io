export interface RequiredField {
  id: string;
  label: string;
  errorId: string;
}

export function formatParticipantId(input: string): string {
  const clean = (input || '').trim();
  if (!clean) return 'P01';
  const match = clean.match(/\d+/);
  if (match) {
    const num = parseInt(match[0], 10);
    const padded = num < 10 ? `0${num}` : `${num}`;
    return `P${padded}`;
  }
  return clean.toUpperCase();
}

const GOOGLE_SHEETS_ENDPOINT_KEY = 'research-tools-google-apps-script-url';

export function initializeResearchSaveOptions() {
  const optionCsv = document.getElementById('card-option-csv');
  const optionSheets = document.getElementById('card-option-sheets');
  const sheetsInputsRow = document.getElementById('sheets-inputs-row');
  const endpointInput = document.getElementById('sheet-url') as HTMLInputElement | null;
  let currentOption: 'local' | 'googlesheets' = 'googlesheets';

  const setOption = (option: 'local' | 'googlesheets') => {
    currentOption = option;
    const useSheets = option === 'googlesheets';
    optionSheets?.classList.toggle('active', useSheets);
    optionCsv?.classList.toggle('active', !useSheets);
    sheetsInputsRow?.classList.toggle('hidden', !useSheets);
    const sheetsRadio = optionSheets?.querySelector<HTMLInputElement>('input[type="radio"]');
    const csvRadio = optionCsv?.querySelector<HTMLInputElement>('input[type="radio"]');
    if (sheetsRadio) sheetsRadio.checked = useSheets;
    if (csvRadio) csvRadio.checked = !useSheets;
  };

  optionSheets?.addEventListener('click', () => setOption('googlesheets'));
  optionCsv?.addEventListener('click', () => setOption('local'));

  if (endpointInput) {
    try {
      endpointInput.value = localStorage.getItem(GOOGLE_SHEETS_ENDPOINT_KEY) || '';
    } catch {
      // Storage can be unavailable in private or locked-down browser contexts.
    }

    endpointInput.addEventListener('input', () => {
      try {
        const endpoint = endpointInput.value.trim();
        if (endpoint) localStorage.setItem(GOOGLE_SHEETS_ENDPOINT_KEY, endpoint);
        else localStorage.removeItem(GOOGLE_SHEETS_ENDPOINT_KEY);
      } catch {
        // The form remains usable even when browser storage is unavailable.
      }
    });
  }

  setOption('googlesheets');

  return {
    get currentOption() {
      return currentOption;
    },
  };
}

export function showToolAlert(
  alertBox: HTMLElement | null,
  message: string,
  focus = true,
) {
  if (!alertBox) return;
  alertBox.replaceChildren(document.createTextNode(message));
  alertBox.className = 'tool-alert';
  alertBox.setAttribute('role', 'alert');
  alertBox.setAttribute('aria-live', 'assertive');
  alertBox.setAttribute('aria-atomic', 'true');
  alertBox.tabIndex = -1;
  if (focus) alertBox.focus({ preventScroll: true });
  alertBox.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth',
    block: 'center',
  });
}

export function clearToolAlert(alertBox: HTMLElement | null) {
  if (!alertBox) return;
  alertBox.textContent = '';
  alertBox.classList.add('hidden');
}

export function validateRequiredFields(
  fields: RequiredField[],
  alertBox: HTMLElement | null,
) {
  const validationState: { firstInvalid: HTMLInputElement | null } = { firstInvalid: null };
  const missing: string[] = [];

  fields.forEach(({ id, label, errorId }) => {
    const input = document.getElementById(id) as HTMLInputElement | null;
    const error = document.getElementById(errorId);
    const isInvalid = !input?.value.trim();

    input?.setAttribute('aria-invalid', String(isInvalid));
    if (error) error.textContent = isInvalid ? `Please enter ${label.toLowerCase()}.` : '';

    if (input && isInvalid && !validationState.firstInvalid) validationState.firstInvalid = input;
    if (isInvalid) missing.push(label);

    input?.addEventListener(
      'input',
      () => {
        if (!input.value.trim()) return;
        input.setAttribute('aria-invalid', 'false');
        if (error) error.textContent = '';
      },
      { once: true },
    );
  });

  const firstInvalidInput = validationState.firstInvalid;
  if (!firstInvalidInput) {
    clearToolAlert(alertBox);
    return true;
  }

  showToolAlert(
    alertBox,
    `Complete the required ${missing.join(' and ')} field${missing.length === 1 ? '' : 's'}.`,
    false,
  );
  firstInvalidInput.focus();
  return false;
}

export function markQuestionGroupInvalid(
  group: HTMLElement | null,
  alertBox: HTMLElement | null,
  message: string,
) {
  showToolAlert(alertBox, message, false);
  if (!group) return;
  group.classList.add('question-group-invalid');
  group.setAttribute('aria-invalid', 'true');
  const focusTarget = group.querySelector<HTMLElement>(
    'input, button, [tabindex]:not([tabindex="-1"])',
  );
  focusTarget?.focus();
  group.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth',
    block: 'center',
  });
}

export function showSaveToast(message: string, type: 'loading' | 'success' | 'error' | 'info' = 'info') {
  let toastBox = document.getElementById('research-save-toast');
  if (!toastBox) {
    toastBox = document.createElement('div');
    toastBox.id = 'research-save-toast';
    toastBox.className = 'research-save-toast';
    document.body.appendChild(toastBox);
  }

  const iconMap: Record<string, string> = {
    loading: '⏳',
    success: '✅',
    error: '❌',
    info: 'ℹ️',
  };

  toastBox.innerHTML = `<span class="toast-icon">${iconMap[type]}</span><span class="toast-message">${message}</span>`;
  toastBox.setAttribute('data-type', type);
  toastBox.classList.add('visible');

  if (type === 'success' || type === 'error') {
    setTimeout(() => {
      toastBox?.classList.remove('visible');
    }, 3500);
  }
}

export async function submitResearchData(options: {
  endpoint: string;
  sheetName: string;
  tool: string;
  payload: Record<string, unknown>;
}) {
  const endpoint = options.endpoint.trim();
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(endpoint);
  } catch {
    throw new Error('Please enter a valid Google Sheets Web App URL.');
  }

  if (endpoint.includes('docs.google.com/spreadsheets/d/')) {
    throw new Error(
      'You entered a Google Sheet document link. Google Sheets requires a deployed Web App URL (ending in /exec) to save data. Click "How to connect your Google Sheet" in the form above for the 1-minute setup code!',
    );
  }

  let payloadData: string;
  if (options.payload && Array.isArray(options.payload.rows)) {
    payloadData = JSON.stringify({
      sheetName: options.sheetName,
      rows: options.payload.rows,
    });
  } else {
    payloadData = JSON.stringify({
      tool: options.tool,
      sheetName: options.sheetName,
      submittedAt: new Date().toISOString(),
      ...options.payload,
    });
  }

  try {
    showSaveToast('Saving data to Google Sheets...', 'loading');
    // Send via fetch mode no-cors for guaranteed cross-origin delivery to script.google.com
    await fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: payloadData,
    });
    showSaveToast('Data saved successfully to Google Sheets!', 'success');
    return;
  } catch (err) {
    showSaveToast('Failed to save data to Google Sheets.', 'error');
    throw new Error(
      err instanceof Error ? err.message : 'Could not submit data to Google Sheets.',
    );
  }
}

export function showRemoteSaveFailure(options: {
  alertBox: HTMLElement | null;
  message: string;
  onRetry: () => void;
  onDownload: () => void;
}) {
  const { alertBox } = options;
  if (!alertBox) return;

  alertBox.className = 'tool-alert';
  alertBox.setAttribute('role', 'alert');
  alertBox.setAttribute('aria-live', 'assertive');
  alertBox.replaceChildren();

  const text = document.createElement('p');
  text.textContent = `Google Sheets save failed: ${options.message}`;

  const actions = document.createElement('div');
  actions.className = 'tool-alert-actions';

  const retry = document.createElement('button');
  retry.type = 'button';
  retry.textContent = 'Retry Google Sheets';
  retry.addEventListener('click', options.onRetry);

  const download = document.createElement('button');
  download.type = 'button';
  download.textContent = 'Download CSV instead';
  download.addEventListener('click', options.onDownload);

  actions.append(retry, download);
  alertBox.append(text, actions);
  retry.focus();
  alertBox.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth',
    block: 'center',
  });
}
