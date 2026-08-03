export interface RequiredField {
  id: string;
  label: string;
  errorId: string;
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
    throw new Error('Enter a valid Google Apps Script web app URL.');
  }

  if (
    parsedUrl.protocol !== 'https:' ||
    !['script.google.com', 'script.googleusercontent.com'].includes(parsedUrl.hostname)
  ) {
    throw new Error(
      'Use the HTTPS /exec URL from a deployed Google Apps Script web app.',
    );
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    redirect: 'follow',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify({
      tool: options.tool,
      sheetName: options.sheetName,
      submittedAt: new Date().toISOString(),
      ...options.payload,
    }),
  });

  if (!response.ok) {
    throw new Error(`Google Sheets returned ${response.status}.`);
  }

  const responseText = await response.text();
  if (!responseText) {
    throw new Error(
      'The Apps Script did not confirm that the row was stored.',
    );
  }

  let result: { success?: boolean; ok?: boolean; message?: string };
  try {
    result = JSON.parse(responseText);
  } catch {
    throw new Error(
      'The Apps Script must return JSON with success: true after appending the row.',
    );
  }

  if (result.success !== true && result.ok !== true) {
    throw new Error(
      result.message || 'The Google Sheet did not confirm that the row was stored.',
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
