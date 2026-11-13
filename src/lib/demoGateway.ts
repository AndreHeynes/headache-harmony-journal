import { createDemoAiReport, createDemoDatabase, type DemoDatabase, type DemoRow } from './demoData';
import { getDemoScenario, isDemoMode } from './demoMode';

const databases = new Map<string, DemoDatabase>();
const database = () => {
  const scenario = getDemoScenario();
  if (!databases.has(scenario)) databases.set(scenario, createDemoDatabase(scenario));
  return databases.get(scenario)!;
};

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
const json = (value: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(value === null ? null : JSON.stringify(value), {
    status, headers: { 'Content-Type': 'application/json', ...headers },
  });

function header(input: RequestInfo | URL, init: RequestInit | undefined, name: string): string {
  if (init?.headers) return new Headers(init.headers).get(name) || '';
  if (input instanceof Request) return input.headers.get(name) || '';
  return '';
}

function compare(value: unknown, operator: string, raw: string): boolean {
  const expected = decodeURIComponent(raw).replace(/^"|"$/g, '');
  if (operator === 'is') return expected === 'null' ? value == null : expected === 'not.null' ? value != null : value === expected;
  if (operator === 'in') {
    const values = expected.replace(/^\(|\)$/g, '').split(',').map(v => v.replace(/^"|"$/g, ''));
    return values.includes(String(value));
  }
  if (operator === 'like' || operator === 'ilike') {
    const pattern = expected.replace(/%/g, '').toLowerCase();
    return String(value ?? '').toLowerCase().includes(pattern);
  }
  const left = typeof value === 'number' ? value : String(value ?? '');
  const right = typeof value === 'number' ? Number(expected) : expected;
  if (operator === 'eq') return left === right || String(value) === expected;
  if (operator === 'neq') return !(left === right || String(value) === expected);
  if (operator === 'gte') return left >= right;
  if (operator === 'lte') return left <= right;
  if (operator === 'gt') return left > right;
  if (operator === 'lt') return left < right;
  return true;
}

function filtered(rows: DemoRow[], params: URLSearchParams): DemoRow[] {
  let result = rows.filter(row => {
    for (const [key, raw] of params) {
      if (['select', 'order', 'limit', 'offset', 'columns', 'on_conflict'].includes(key)) continue;
      const dot = raw.indexOf('.');
      if (dot < 0) continue;
      const operator = raw.slice(0, dot);
      if (!compare(row[key], operator, raw.slice(dot + 1))) return false;
    }
    return true;
  });
  const order = params.get('order');
  if (order) {
    const [column, direction] = order.split('.');
    result = [...result].sort((a, b) => String(a[column] ?? '').localeCompare(String(b[column] ?? '')) * (direction === 'desc' ? -1 : 1));
  }
  const offset = Number(params.get('offset') || 0);
  const limit = params.get('limit') == null ? result.length : Number(params.get('limit'));
  return result.slice(offset, offset + limit);
}

function project(row: DemoRow, select: string): DemoRow {
  if (!select || select === '*') return clone(row);
  const columns = select.split(',').map(s => s.trim()).filter(s => s && !s.includes('('));
  return Object.fromEntries(columns.filter(c => c in row).map(c => [c, clone(row[c])]));
}

async function bodyOf(input: RequestInfo | URL, init?: RequestInit): Promise<any> {
  if (init?.body) {
    try { return JSON.parse(String(init.body)); } catch { return null; }
  }
  if (input instanceof Request && !['GET', 'HEAD'].includes(input.method)) {
    try { return await input.clone().json(); } catch { return null; }
  }
  return null;
}

function insert(table: DemoRow[], payload: any): DemoRow[] {
  const values = Array.isArray(payload) ? payload : [payload || {}];
  return values.map((value, index) => {
    const now = new Date().toISOString();
    const row: DemoRow = {
      id: value.id || `demo-local-${Date.now()}-${index}`,
      created_at: value.created_at || now, updated_at: now, ...clone(value),
    };
    if ('selection_order' in value || value.episode_id) {
      if (row.selection_order == null && value.episode_id) {
        const orders = table.filter(r => r.episode_id === value.episode_id).map(r => Number(r.selection_order) || 0);
        row.selection_order = Math.max(0, ...orders) + 1;
        row.first_selected_at ||= now;
        row.is_origin = row.selection_order === 1;
      }
    }
    table.push(row);
    return row;
  });
}

async function restResponse(url: URL, input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const tableName = decodeURIComponent(url.pathname.split('/rest/v1/')[1] || '');
  const db = database();
  const table = db[tableName] || (db[tableName] = []);
  const method = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
  const accept = header(input, init, 'Accept');
  const prefer = header(input, init, 'Prefer');
  const single = accept.includes('vnd.pgrst.object');
  const select = url.searchParams.get('select') || '*';

  if (method === 'GET' || method === 'HEAD') {
    const rows = filtered(table, url.searchParams).map(row => project(row, select));
    const count = rows.length;
    if (method === 'HEAD') return json(null, 200, { 'Content-Range': count ? `0-${count - 1}/${count}` : '*/0' });
    return json(single ? rows[0] || null : rows, 200, { 'Content-Range': count ? `0-${count - 1}/${count}` : '*/0' });
  }

  const payload = await bodyOf(input, init);
  if (method === 'POST') {
    const upsert = prefer.includes('resolution=merge-duplicates');
    if (upsert && payload && !Array.isArray(payload)) {
      const conflict = (url.searchParams.get('on_conflict') || 'id').split(',');
      const existing = table.find(row => conflict.every(key => row[key] === payload[key]));
      if (existing) Object.assign(existing, clone(payload), { updated_at: new Date().toISOString() });
      else insert(table, payload);
      return json(single ? existing || payload : [existing || payload], 201);
    }
    const inserted = insert(table, payload);
    return json(single ? inserted[0] : inserted, 201);
  }
  if (method === 'PATCH') {
    const rows = filtered(table, url.searchParams);
    rows.forEach(row => Object.assign(row, clone(payload || {}), { updated_at: new Date().toISOString() }));
    const projected = rows.map(row => project(row, select));
    return json(single ? projected[0] || null : projected);
  }
  if (method === 'DELETE') {
    const remove = new Set(filtered(table, url.searchParams).map(row => row.id));
    db[tableName] = table.filter(row => !remove.has(row.id));
    return json([]);
  }
  return json({ message: 'Unsupported demo request' }, 400);
}

/** Intercepts only backend requests while ?demo=1 is active; all records stay in this tab's memory. */
export function installDemoGateway() {
  if (typeof window === 'undefined' || !isDemoMode()) return;
  const nativeFetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const raw = input instanceof Request ? input.url : String(input);
    const url = new URL(raw, window.location.origin);
    if (!isDemoMode()) return nativeFetch(input, init);
    if (url.pathname.includes('/rest/v1/')) return restResponse(url, input, init);
    if (url.pathname.includes('/functions/v1/generate-ai-report')) {
      await new Promise(resolve => setTimeout(resolve, 250));
      return json(createDemoAiReport(getDemoScenario()));
    }
    if (url.pathname.includes('/functions/v1/')) return json({ error: 'This action is disabled in the fictional demo.' });
    if (url.hostname.includes('supabase')) return json({ message: 'Backend access is disabled in demo mode.' }, 403);
    return nativeFetch(input, init);
  };
}
