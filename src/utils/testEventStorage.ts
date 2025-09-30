/**
 * Test Event Storage Management
 * Handles localStorage persistence for beta-testing feedback and events
 */

import { TestEvent, SessionInfo } from "@/contexts/test/types";

const STORAGE_VERSION = "1.0";
const STORAGE_KEY = "test_events_v1";
const SESSION_KEY = "test_sessions_v1";
const MAX_EVENTS = 1000;
const MAX_AGE_DAYS = 30;

export interface StorageData {
  version: string;
  lastUpdated: number;
  events: TestEvent[];
}

export interface StorageStats {
  totalEvents: number;
  storageSize: string;
  oldestEvent: Date | null;
  newestEvent: Date | null;
  feedbackCount: number;
  errorCount: number;
}

/**
 * Check if localStorage is available
 */
const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    console.warn('localStorage is not available:', e);
    return false;
  }
};

/**
 * Save test events to localStorage
 */
export const saveTestEvents = (events: TestEvent[]): void => {
  if (!isLocalStorageAvailable()) {
    console.warn('Cannot save events: localStorage not available');
    return;
  }

  try {
    // Prune old events before saving
    const prunedEvents = pruneEvents(events);
    
    const storageData: StorageData = {
      version: STORAGE_VERSION,
      lastUpdated: Date.now(),
      events: prunedEvents
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
  } catch (error) {
    console.error('Failed to save test events:', error);
    
    // If quota exceeded, try to free up space
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      try {
        // Keep only the most recent 500 events
        const reducedEvents = events.slice(0, 500);
        const storageData: StorageData = {
          version: STORAGE_VERSION,
          lastUpdated: Date.now(),
          events: reducedEvents
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
        console.warn('Storage quota exceeded. Reduced to 500 most recent events.');
      } catch (retryError) {
        console.error('Failed to save even after reducing events:', retryError);
      }
    }
  }
};

/**
 * Load test events from localStorage
 */
export const loadTestEvents = (): TestEvent[] => {
  if (!isLocalStorageAvailable()) {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const data: StorageData = JSON.parse(stored);
    
    // Validate data structure
    if (!data.events || !Array.isArray(data.events)) {
      console.warn('Invalid storage data structure');
      return [];
    }

    // Prune old events on load
    const prunedEvents = pruneEvents(data.events);
    
    // If events were pruned, save the updated list
    if (prunedEvents.length !== data.events.length) {
      saveTestEvents(prunedEvents);
    }

    return prunedEvents;
  } catch (error) {
    console.error('Failed to load test events:', error);
    return [];
  }
};

/**
 * Prune events based on age and count limits
 */
const pruneEvents = (events: TestEvent[]): TestEvent[] => {
  if (!events || events.length === 0) {
    return [];
  }

  const now = Date.now();
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60 * 1000; // 30 days in milliseconds

  // Filter out events older than 30 days
  let filteredEvents = events.filter(event => {
    const age = now - event.timestamp;
    return age < maxAge;
  });

  // Keep only the most recent MAX_EVENTS
  if (filteredEvents.length > MAX_EVENTS) {
    filteredEvents = filteredEvents.slice(0, MAX_EVENTS);
  }

  return filteredEvents;
};

/**
 * Clear all test events from localStorage
 */
export const clearTestEvents = (): void => {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear test events:', error);
  }
};

/**
 * Get storage statistics
 */
export const getStorageStats = (events: TestEvent[]): StorageStats => {
  if (!events || events.length === 0) {
    return {
      totalEvents: 0,
      storageSize: '0 KB',
      oldestEvent: null,
      newestEvent: null,
      feedbackCount: 0,
      errorCount: 0
    };
  }

  // Calculate storage size
  const dataStr = JSON.stringify(events);
  const sizeInBytes = new Blob([dataStr]).size;
  const sizeInKB = (sizeInBytes / 1024).toFixed(2);

  // Find oldest and newest events
  const sortedByTime = [...events].sort((a, b) => a.timestamp - b.timestamp);
  const oldestEvent = sortedByTime[0] ? new Date(sortedByTime[0].timestamp) : null;
  const newestEvent = sortedByTime[sortedByTime.length - 1] ? new Date(sortedByTime[sortedByTime.length - 1].timestamp) : null;

  // Count feedback and errors
  const feedbackCount = events.filter(e => e.type === 'feedback').length;
  const errorCount = events.filter(e => e.type === 'error').length;

  return {
    totalEvents: events.length,
    storageSize: `${sizeInKB} KB`,
    oldestEvent,
    newestEvent,
    feedbackCount,
    errorCount
  };
};

/**
 * Export all events as JSON
 */
export const exportAllEvents = (events: TestEvent[], sessionInfo: SessionInfo): void => {
  try {
    const stats = getStorageStats(events);
    
    const exportData = {
      exportDate: new Date().toISOString(),
      exportVersion: STORAGE_VERSION,
      currentSession: sessionInfo,
      storageInfo: stats,
      events: events
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `headache-tracker-test-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  } catch (error) {
    console.error('Failed to export events:', error);
    throw error;
  }
};

/**
 * Export only feedback events
 */
export const exportFeedbackOnly = (events: TestEvent[]): void => {
  try {
    const feedbackEvents = events.filter(e => e.type === 'feedback');
    
    // Group by feedback type
    const feedbackByType: Record<string, number> = {};
    feedbackEvents.forEach(event => {
      const type = event.metadata?.feedbackType || 'unknown';
      feedbackByType[type] = (feedbackByType[type] || 0) + 1;
    });

    const exportData = {
      exportDate: new Date().toISOString(),
      totalFeedback: feedbackEvents.length,
      feedbackByType,
      feedback: feedbackEvents.map(event => ({
        timestamp: event.timestamp,
        date: new Date(event.timestamp).toLocaleString(),
        type: event.metadata?.feedbackType || 'unknown',
        rating: event.metadata?.rating || null,
        content: event.metadata?.content || event.details,
        component: event.component
      }))
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `my-feedback-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  } catch (error) {
    console.error('Failed to export feedback:', error);
    throw error;
  }
};

/**
 * Clear events older than specified days
 */
export const clearOldEvents = (events: TestEvent[], daysOld: number): TestEvent[] => {
  const now = Date.now();
  const maxAge = daysOld * 24 * 60 * 60 * 1000;
  
  return events.filter(event => {
    const age = now - event.timestamp;
    return age < maxAge;
  });
};

/**
 * Save session info to localStorage
 */
export const saveSessionInfo = (sessionInfo: SessionInfo): void => {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    const sessions = loadSessionHistory();
    sessions.push(sessionInfo);
    
    // Keep only last 50 sessions
    const recentSessions = sessions.slice(-50);
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(recentSessions));
  } catch (error) {
    console.error('Failed to save session info:', error);
  }
};

/**
 * Load session history from localStorage
 */
export const loadSessionHistory = (): SessionInfo[] => {
  if (!isLocalStorageAvailable()) {
    return [];
  }

  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) {
      return [];
    }

    const sessions: SessionInfo[] = JSON.parse(stored);
    return Array.isArray(sessions) ? sessions : [];
  } catch (error) {
    console.error('Failed to load session history:', error);
    return [];
  }
};
