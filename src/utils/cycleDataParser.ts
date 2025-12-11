// Types for parsed cycle data
export interface ParsedCycleEntry {
  date: string;
  cycleDay?: number;
  menstrualPhase?: string;
  periodFlow?: string;
  source: 'clue' | 'flo' | 'generic' | 'csv_import';
}

export interface ParseResult {
  success: boolean;
  entries: ParsedCycleEntry[];
  errors: string[];
  detectedFormat: 'clue' | 'flo' | 'generic' | 'unknown';
  totalRows: number;
  validRows: number;
}

// Valid menstrual phases
const VALID_PHASES = ['menstrual', 'follicular', 'ovulation', 'ovulatory', 'luteal'];
const VALID_FLOWS = ['light', 'medium', 'heavy', 'spotting', 'none'];

// Clue CSV format detection
const CLUE_HEADERS = ['date', 'period', 'flow', 'cycle day'];

// Flo CSV format detection
const FLO_HEADERS = ['date', 'period flow', 'cycle phase'];

// Generic CSV headers we'll accept
const GENERIC_HEADERS = ['date', 'phase', 'flow', 'cycle_day', 'cycle day', 'menstrual_phase'];

function normalizePhase(phase: string): string | undefined {
  const normalized = phase.toLowerCase().trim();
  
  // Map common variations
  const phaseMap: Record<string, string> = {
    'period': 'menstrual',
    'bleeding': 'menstrual',
    'menstruation': 'menstrual',
    'ovulatory': 'ovulation',
    'pre-ovulation': 'follicular',
    'post-ovulation': 'luteal',
    'pre-menstrual': 'luteal',
    'pms': 'luteal',
  };

  if (phaseMap[normalized]) return phaseMap[normalized];
  if (VALID_PHASES.includes(normalized)) return normalized;
  
  // Check if any valid phase is contained in the string
  for (const validPhase of VALID_PHASES) {
    if (normalized.includes(validPhase)) return validPhase;
  }
  
  return undefined;
}

function normalizeFlow(flow: string): string | undefined {
  const normalized = flow.toLowerCase().trim();
  
  const flowMap: Record<string, string> = {
    'very light': 'light',
    'very heavy': 'heavy',
    'moderate': 'medium',
    'normal': 'medium',
    'spot': 'spotting',
  };
  
  if (flowMap[normalized]) return flowMap[normalized];
  if (VALID_FLOWS.includes(normalized)) return normalized;
  
  for (const validFlow of VALID_FLOWS) {
    if (normalized.includes(validFlow)) return validFlow;
  }
  
  return undefined;
}

function parseDate(dateStr: string): string | null {
  // Try multiple date formats
  const formats = [
    // ISO format
    /^(\d{4})-(\d{2})-(\d{2})/,
    // US format
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})/,
    // EU format
    /^(\d{1,2})\.(\d{1,2})\.(\d{4})/,
    // Another common format
    /^(\d{1,2})-(\d{1,2})-(\d{4})/,
  ];

  for (const format of formats) {
    const match = dateStr.match(format);
    if (match) {
      let year: string, month: string, day: string;
      
      if (format === formats[0]) {
        // ISO: YYYY-MM-DD
        [, year, month, day] = match;
      } else if (format === formats[1]) {
        // US: MM/DD/YYYY
        [, month, day, year] = match;
      } else {
        // EU or other: DD.MM.YYYY or DD-MM-YYYY
        [, day, month, year] = match;
      }
      
      const date = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    }
  }
  
  // Try native parsing as fallback
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }
  
  return null;
}

function detectFormat(headers: string[]): 'clue' | 'flo' | 'generic' | 'unknown' {
  const normalizedHeaders = headers.map(h => h.toLowerCase().trim());
  
  // Check for Clue format
  const clueMatch = CLUE_HEADERS.filter(h => 
    normalizedHeaders.some(nh => nh.includes(h))
  ).length;
  if (clueMatch >= 2) return 'clue';
  
  // Check for Flo format
  const floMatch = FLO_HEADERS.filter(h => 
    normalizedHeaders.some(nh => nh.includes(h))
  ).length;
  if (floMatch >= 2) return 'flo';
  
  // Check for generic format
  const genericMatch = GENERIC_HEADERS.filter(h => 
    normalizedHeaders.some(nh => nh.includes(h) || nh === h)
  ).length;
  if (genericMatch >= 1 && normalizedHeaders.includes('date')) return 'generic';
  
  return 'unknown';
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

export function parseClueCSV(content: string): ParseResult {
  const lines = content.split(/\r?\n/).filter(line => line.trim());
  const errors: string[] = [];
  const entries: ParsedCycleEntry[] = [];
  
  if (lines.length < 2) {
    return { success: false, entries: [], errors: ['CSV file is empty or has no data rows'], detectedFormat: 'clue', totalRows: 0, validRows: 0 };
  }
  
  const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());
  const dateIdx = headers.findIndex(h => h.includes('date'));
  const flowIdx = headers.findIndex(h => h.includes('flow') || h.includes('period'));
  const cycleDayIdx = headers.findIndex(h => h.includes('cycle day') || h.includes('day'));
  
  if (dateIdx === -1) {
    return { success: false, entries: [], errors: ['No date column found in CSV'], detectedFormat: 'clue', totalRows: lines.length - 1, validRows: 0 };
  }
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const dateStr = values[dateIdx];
    
    if (!dateStr) continue;
    
    const date = parseDate(dateStr);
    if (!date) {
      errors.push(`Row ${i + 1}: Invalid date format "${dateStr}"`);
      continue;
    }
    
    const entry: ParsedCycleEntry = {
      date,
      source: 'clue',
    };
    
    if (flowIdx !== -1 && values[flowIdx]) {
      const flow = normalizeFlow(values[flowIdx]);
      if (flow) {
        entry.periodFlow = flow;
        // If there's flow, assume menstrual phase
        if (flow !== 'none') {
          entry.menstrualPhase = 'menstrual';
        }
      }
    }
    
    if (cycleDayIdx !== -1 && values[cycleDayIdx]) {
      const cycleDay = parseInt(values[cycleDayIdx]);
      if (!isNaN(cycleDay) && cycleDay > 0 && cycleDay <= 45) {
        entry.cycleDay = cycleDay;
        // Estimate phase from cycle day if not already set
        if (!entry.menstrualPhase) {
          if (cycleDay <= 5) entry.menstrualPhase = 'menstrual';
          else if (cycleDay <= 13) entry.menstrualPhase = 'follicular';
          else if (cycleDay <= 16) entry.menstrualPhase = 'ovulation';
          else entry.menstrualPhase = 'luteal';
        }
      }
    }
    
    entries.push(entry);
  }
  
  return {
    success: entries.length > 0,
    entries,
    errors,
    detectedFormat: 'clue',
    totalRows: lines.length - 1,
    validRows: entries.length,
  };
}

export function parseFloCSV(content: string): ParseResult {
  const lines = content.split(/\r?\n/).filter(line => line.trim());
  const errors: string[] = [];
  const entries: ParsedCycleEntry[] = [];
  
  if (lines.length < 2) {
    return { success: false, entries: [], errors: ['CSV file is empty or has no data rows'], detectedFormat: 'flo', totalRows: 0, validRows: 0 };
  }
  
  const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());
  const dateIdx = headers.findIndex(h => h.includes('date'));
  const flowIdx = headers.findIndex(h => h.includes('flow'));
  const phaseIdx = headers.findIndex(h => h.includes('phase'));
  
  if (dateIdx === -1) {
    return { success: false, entries: [], errors: ['No date column found in CSV'], detectedFormat: 'flo', totalRows: lines.length - 1, validRows: 0 };
  }
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const dateStr = values[dateIdx];
    
    if (!dateStr) continue;
    
    const date = parseDate(dateStr);
    if (!date) {
      errors.push(`Row ${i + 1}: Invalid date format "${dateStr}"`);
      continue;
    }
    
    const entry: ParsedCycleEntry = {
      date,
      source: 'flo',
    };
    
    if (flowIdx !== -1 && values[flowIdx]) {
      entry.periodFlow = normalizeFlow(values[flowIdx]);
    }
    
    if (phaseIdx !== -1 && values[phaseIdx]) {
      entry.menstrualPhase = normalizePhase(values[phaseIdx]);
    }
    
    entries.push(entry);
  }
  
  return {
    success: entries.length > 0,
    entries,
    errors,
    detectedFormat: 'flo',
    totalRows: lines.length - 1,
    validRows: entries.length,
  };
}

export function parseGenericCSV(content: string): ParseResult {
  const lines = content.split(/\r?\n/).filter(line => line.trim());
  const errors: string[] = [];
  const entries: ParsedCycleEntry[] = [];
  
  if (lines.length < 2) {
    return { success: false, entries: [], errors: ['CSV file is empty or has no data rows'], detectedFormat: 'generic', totalRows: 0, validRows: 0 };
  }
  
  const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());
  const dateIdx = headers.findIndex(h => h === 'date' || h.includes('date'));
  const phaseIdx = headers.findIndex(h => h.includes('phase') || h.includes('menstrual'));
  const flowIdx = headers.findIndex(h => h.includes('flow'));
  const cycleDayIdx = headers.findIndex(h => h.includes('cycle') && h.includes('day'));
  
  if (dateIdx === -1) {
    return { success: false, entries: [], errors: ['No date column found in CSV'], detectedFormat: 'generic', totalRows: lines.length - 1, validRows: 0 };
  }
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const dateStr = values[dateIdx];
    
    if (!dateStr) continue;
    
    const date = parseDate(dateStr);
    if (!date) {
      errors.push(`Row ${i + 1}: Invalid date format "${dateStr}"`);
      continue;
    }
    
    const entry: ParsedCycleEntry = {
      date,
      source: 'generic',
    };
    
    if (phaseIdx !== -1 && values[phaseIdx]) {
      entry.menstrualPhase = normalizePhase(values[phaseIdx]);
    }
    
    if (flowIdx !== -1 && values[flowIdx]) {
      entry.periodFlow = normalizeFlow(values[flowIdx]);
    }
    
    if (cycleDayIdx !== -1 && values[cycleDayIdx]) {
      const cycleDay = parseInt(values[cycleDayIdx]);
      if (!isNaN(cycleDay) && cycleDay > 0 && cycleDay <= 45) {
        entry.cycleDay = cycleDay;
      }
    }
    
    entries.push(entry);
  }
  
  return {
    success: entries.length > 0,
    entries,
    errors,
    detectedFormat: 'generic',
    totalRows: lines.length - 1,
    validRows: entries.length,
  };
}

export function parseCycleCSV(content: string, forceFormat?: 'clue' | 'flo' | 'generic'): ParseResult {
  const lines = content.split(/\r?\n/).filter(line => line.trim());
  
  if (lines.length < 1) {
    return { 
      success: false, 
      entries: [], 
      errors: ['CSV file is empty'], 
      detectedFormat: 'unknown', 
      totalRows: 0, 
      validRows: 0 
    };
  }
  
  const headers = parseCSVLine(lines[0]);
  const format = forceFormat || detectFormat(headers);
  
  switch (format) {
    case 'clue':
      return parseClueCSV(content);
    case 'flo':
      return parseFloCSV(content);
    case 'generic':
      return parseGenericCSV(content);
    default:
      // Try generic parser as fallback
      const result = parseGenericCSV(content);
      if (result.success) {
        return { ...result, detectedFormat: 'generic' };
      }
      return { 
        success: false, 
        entries: [], 
        errors: ['Could not detect CSV format. Please ensure your CSV has a "date" column and optionally "phase", "flow", or "cycle_day" columns.'], 
        detectedFormat: 'unknown', 
        totalRows: lines.length - 1, 
        validRows: 0 
      };
  }
}
