/**
 * User Session Management
 * Provides temporary user sessions for beta testing before database integration
 */

export interface UserSession {
  id: string;
  fingerprint: string;
  createdAt: string;
  lastActivity: string;
  isBetaTester: boolean;
}

export interface ExportLog {
  id: string;
  userId: string;
  exportType: 'pdf' | 'csv';
  timestamp: string;
  recordCount: number;
  fileSize?: number;
}

// Generate a unique user session ID
export const generateSessionId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomBytes = new Uint8Array(8);
  window.crypto.getRandomValues(randomBytes);
  const randomString = Array.from(randomBytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
  return `user_${timestamp}_${randomString}`;
};

// Create a browser fingerprint for basic security
export const generateBrowserFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx?.fillText('fingerprint', 10, 10);
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');
  
  return btoa(fingerprint).slice(0, 32);
};

// Get or create user session
export const getUserSession = (): UserSession => {
  const existingSession = localStorage.getItem('user_session');
  
  if (existingSession) {
    try {
      const session = JSON.parse(existingSession) as UserSession;
      // Update last activity
      session.lastActivity = new Date().toISOString();
      localStorage.setItem('user_session', JSON.stringify(session));
      return session;
    } catch (error) {
      console.error('Invalid session data, creating new session');
    }
  }
  
  // Create new session
  const newSession: UserSession = {
    id: generateSessionId(),
    fingerprint: generateBrowserFingerprint(),
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    isBetaTester: localStorage.getItem('enableTesting') === 'true'
  };
  
  localStorage.setItem('user_session', JSON.stringify(newSession));
  return newSession;
};

// Validate user session
export const validateUserSession = (): boolean => {
  try {
    const session = getUserSession();
    const currentFingerprint = generateBrowserFingerprint();
    
    // Basic validation - check if fingerprint matches
    if (session.fingerprint !== currentFingerprint) {
      console.warn('Session fingerprint mismatch - potential security issue');
      return false;
    }
    
    // Check if session is too old (7 days for beta testing)
    const sessionAge = Date.now() - new Date(session.createdAt).getTime();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    
    if (sessionAge > maxAge) {
      console.warn('Session expired');
      clearUserSession();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Session validation failed:', error);
    return false;
  }
};

// Clear user session
export const clearUserSession = (): void => {
  localStorage.removeItem('user_session');
};

// Log export activity
export const logExportActivity = (exportType: 'pdf' | 'csv', recordCount: number, fileSize?: number): void => {
  try {
    const session = getUserSession();
    const exportLog: ExportLog = {
      id: `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: session.id,
      exportType,
      timestamp: new Date().toISOString(),
      recordCount,
      fileSize
    };
    
    // Get existing logs
    const existingLogs = JSON.parse(localStorage.getItem('export_logs') || '[]') as ExportLog[];
    
    // Add new log
    existingLogs.push(exportLog);
    
    // Keep only last 50 exports to prevent storage bloat
    const recentLogs = existingLogs.slice(-50);
    
    localStorage.setItem('export_logs', JSON.stringify(recentLogs));
  } catch (error) {
    console.error('Failed to log export activity:', error);
  }
};

// Get user's export history
export const getUserExportHistory = (): ExportLog[] => {
  try {
    const session = getUserSession();
    const allLogs = JSON.parse(localStorage.getItem('export_logs') || '[]') as ExportLog[];
    
    // Return only this user's exports
    return allLogs.filter(log => log.userId === session.id);
  } catch (error) {
    console.error('Failed to get export history:', error);
    return [];
  }
};
