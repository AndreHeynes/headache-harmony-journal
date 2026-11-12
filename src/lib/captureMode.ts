// Screenshot capture mode: ?capture=1 hides floating UI for marketing captures (tab-scoped).
const KEY = 'journal-capture-v1';
export function isCaptureMode(search = typeof window !== 'undefined' ? window.location.search : ''): boolean {
  const v = new URLSearchParams(search).get('capture');
  try {
    if (v === '1') sessionStorage.setItem(KEY, '1');
    if (v === '0') sessionStorage.removeItem(KEY);
    return sessionStorage.getItem(KEY) === '1';
  } catch { return v === '1'; }
}
