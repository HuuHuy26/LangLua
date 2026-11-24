// Service to manage and sync workshop registration count with Google Forms / Google Sheets

const STORAGE_KEY = 'langvanphuc_workshop_registrations';
const USER_REGISTERED_KEY = 'langvanphuc_has_registered';
const GOOGLE_SHEET_KEY = 'langvanphuc_google_sheet_url';

export function extractSheetId(inputUrl: string): string | null {
  if (!inputUrl) return null;
  // Match /d/{id}/ or id=...
  const match = inputUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) return match[1];
  const matchPub = inputUrl.match(/\/spreadsheets\/d\/e\/([a-zA-Z0-9-_]+)/);
  if (matchPub && matchPub[1]) return matchPub[1];
  return null;
}

export async function fetchGoogleSheetCount(sheetUrlOrId: string): Promise<number | null> {
  try {
    const trimmed = sheetUrlOrId.trim();
    let fetchUrl = trimmed;

    if (trimmed.includes('docs.google.com/spreadsheets')) {
      const sheetId = extractSheetId(trimmed);
      if (trimmed.includes('/pub?')) {
        fetchUrl = trimmed.includes('output=csv') ? trimmed : `${trimmed}&output=csv`;
      } else if (sheetId) {
        fetchUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
      }
    }

    const res = await fetch(fetchUrl);
    if (!res.ok) return null;
    const text = await res.text();
    // Exclude header row and empty lines
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length <= 1) return 0;
    // Minus 1 for header row
    return Math.max(0, lines.length - 1);
  } catch {
    return null;
  }
}

export const eventRegistrationService = {
  // Get current participant count
  getCount: async (fallbackCount: number = 0): Promise<number> => {
    // 1. Check Google Sheet if configured
    const sheetUrl = typeof window !== 'undefined' ? localStorage.getItem(GOOGLE_SHEET_KEY) : null;
    if (sheetUrl) {
      const sheetCount = await fetchGoogleSheetCount(sheetUrl);
      if (sheetCount !== null) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, String(sheetCount));
        }
        return sheetCount;
      }
    }

    // 2. Check localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const n = parseInt(saved, 10);
        if (!isNaN(n)) return n;
      }
    }

    return fallbackCount;
  },

  // Record a new registration
  recordRegistration: (): number => {
    if (typeof window === 'undefined') return 1;
    const currentStr = localStorage.getItem(STORAGE_KEY);
    const current = currentStr !== null ? parseInt(currentStr, 10) : 0;
    const updated = isNaN(current) ? 1 : current + 1;
    localStorage.setItem(STORAGE_KEY, String(updated));
    localStorage.setItem(USER_REGISTERED_KEY, 'true');
    window.dispatchEvent(new Event('workshop-registered-updated'));
    return updated;
  },

  hasUserRegistered: (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(USER_REGISTERED_KEY) === 'true';
  },

  setGoogleSheetUrl: (url: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(GOOGLE_SHEET_KEY, url.trim());
    window.dispatchEvent(new Event('workshop-registered-updated'));
  },

  getGoogleSheetUrl: (): string => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(GOOGLE_SHEET_KEY) || '';
  },

  setManualCount: (count: number) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, String(count));
    window.dispatchEvent(new Event('workshop-registered-updated'));
  },
};
