/**
 * NOVA — Storage Service
 * Handles persistence for conversations, settings, and workspace preferences in localStorage.
 */

const STORAGE_KEYS = {
  SESSIONS: 'nova_conversations_v1',
  ACTIVE_SESSION: 'nova_active_session_id_v1',
  SETTINGS: 'nova_settings_v1',
  TELEMETRY: 'nova_telemetry_v1'
};

const DEFAULT_SETTINGS = {
  ttsEnabled: true,
  voiceURI: '',
  speechRate: 1.0,
  speechPitch: 1.0,
  quality: 'high',          // 'high' | 'medium' | 'low' | 'static'
  reducedMotion: false,     // manually override or respects system
  particleDensity: 'high',  // 'high' | 'medium' | 'low'
  themeAccent: 'cyan',      // 'cyan' | 'violet' | 'emerald'
  showHud: true
};

export class StorageService {
  constructor() {
    this.settings = this.loadSettings();
  }

  // --------------------------------------------------------------------------
  // Settings Management
  // --------------------------------------------------------------------------
  loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('[Storage] Failed to read settings, using defaults:', e);
    }
    return { ...DEFAULT_SETTINGS };
  }

  saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
    } catch (e) {
      console.error('[Storage] Error saving settings:', e);
    }
    return this.settings;
  }

  // --------------------------------------------------------------------------
  // Conversations Management
  // --------------------------------------------------------------------------
  getSessions() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (raw) {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      console.warn('[Storage] Failed to load sessions:', e);
    }
    return [];
  }

  saveSessions(sessions) {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (e) {
      console.error('[Storage] Error saving sessions:', e);
    }
  }

  getActiveSessionId() {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION) || null;
    } catch (e) {
      return null;
    }
  }

  setActiveSessionId(id) {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, id);
    } catch (e) {
      console.warn('[Storage] Error saving active session id:', e);
    }
  }

  createSession(title = 'New Neural Session') {
    const sessions = this.getSessions();
    const newSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: []
    };
    sessions.unshift(newSession);
    this.saveSessions(sessions);
    this.setActiveSessionId(newSession.id);
    return newSession;
  }

  getSession(id) {
    const sessions = this.getSessions();
    return sessions.find(s => s.id === id) || null;
  }

  updateSessionMessages(sessionId, messages) {
    const sessions = this.getSessions();
    const index = sessions.findIndex(s => s.id === sessionId);
    if (index !== -1) {
      sessions[index].messages = messages;
      sessions[index].updatedAt = new Date().toISOString();
      // Auto-update title if it's still default and user has sent a message
      if (sessions[index].title === 'New Neural Session' && messages.length > 0) {
        const firstUserMsg = messages.find(m => m.role === 'user');
        if (firstUserMsg) {
          const cleanText = firstUserMsg.content.trim().slice(0, 36);
          sessions[index].title = cleanText + (firstUserMsg.content.length > 36 ? '...' : '');
        }
      }
      this.saveSessions(sessions);
    }
  }

  deleteSession(sessionId) {
    let sessions = this.getSessions();
    sessions = sessions.filter(s => s.id !== sessionId);
    this.saveSessions(sessions);

    if (this.getActiveSessionId() === sessionId) {
      const nextId = sessions.length > 0 ? sessions[0].id : null;
      if (nextId) {
        this.setActiveSessionId(nextId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
      }
    }
    return sessions;
  }

  clearAllData() {
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSIONS);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.TELEMETRY);
      this.settings = { ...DEFAULT_SETTINGS };
    } catch (e) {
      console.error('[Storage] Error clearing storage:', e);
    }
  }

  exportDataJson() {
    const exportObj = {
      exportedAt: new Date().toISOString(),
      app: 'NOVA AI Workspace',
      settings: this.settings,
      sessions: this.getSessions()
    };
    return JSON.stringify(exportObj, null, 2);
  }
}

export const storage = new StorageService();

