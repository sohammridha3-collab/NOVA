/**
 * NOVA — Modular API Adapter Service (Stage 2 AI & Structured Action Integration)
 * Coordinates request communication with both:
 * 1. High-fidelity client simulator (Demo Mode)
 * 2. Real Node.js/Express + MySQL Backend API (Live Mode with AI & Tool Registry)
 *
 * Implements the standard JSON response contract:
 * { success: true, data: { ... }, meta: { requestId, timestamp } }
 */

import { getSimulatedResponse } from './mockData.js';

export class ApiAdapter {
  constructor() {
    // Explicit demo mode option, persisted in localStorage
    const savedDemo = localStorage.getItem('nova_demo_mode');
    this.isDemoMode = savedDemo !== null ? savedDemo === 'true' : true;

    this.apiBase = '/api';
    this.apiKey = 'nova_dev_api_key_8f1c4e92';
    this.authToken = localStorage.getItem('nova_auth_token') || null;
    this.activeStreamAbort = null;
    this.lastBackendStatus = null;
  }

  setDemoMode(enabled) {
    this.isDemoMode = Boolean(enabled);
    localStorage.setItem('nova_demo_mode', String(this.isDemoMode));
  }

  setAuthToken(token) {
    this.authToken = token;
    if (token) {
      localStorage.setItem('nova_auth_token', token);
    } else {
      localStorage.removeItem('nova_auth_token');
    }
  }

  /**
   * Probes backend health, MySQL readiness, and AI Provider status.
   * Returns structured diagnostic information.
   */
  async checkBackendStatus() {
    try {
      const res = await fetch(`${this.apiBase}/health/ready`, {
        method: 'GET',
        headers: { Accept: 'application/json' }
      });

      const body = await res.json().catch(() => null);

      if (res.status === 200 && body?.success) {
        this.lastBackendStatus = {
          status: 'connected',
          ready: true,
          db: 'connected',
          host: body.data?.database?.host,
          database: body.data?.database?.database,
          message: 'Backend server and MySQL database are online and ready.'
        };
      } else if (res.status === 503 && body?.error?.code === 'DATABASE_NOT_READY') {
        this.lastBackendStatus = {
          status: 'connected',
          ready: false,
          db: 'disconnected',
          message: body.error.message,
          setupGuide: body.error.details?.setupGuide || 'Check database credentials in backend/.env.'
        };
      } else {
        this.lastBackendStatus = {
          status: 'connected',
          ready: false,
          db: 'error',
          message: body?.error?.message || `Unexpected status code: ${res.status}`
        };
      }
    } catch (err) {
      this.lastBackendStatus = {
        status: 'offline',
        ready: false,
        db: 'unknown',
        message: 'Backend server is not reachable on http://localhost:3001. Please run "npm start" inside backend/ directory.'
      };
    }

    return this.lastBackendStatus;
  }

  /**
   * Query AI provider status and readiness
   */
  async getChatStatus() {
    try {
      return await this._apiRequest('/chat/status');
    } catch (err) {
      return {
        status: 'unreachable',
        provider: 'unknown',
        notice: err.message
      };
    }
  }

  /**
   * Helper to perform authenticated requests to the backend API.
   */
  async _apiRequest(endpoint, options = {}) {
    const url = `${this.apiBase}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-API-Key': this.apiKey,
      ...(this.authToken ? { Authorization: `Bearer ${this.authToken}` } : {}),
      ...(options.headers || {})
    };

    const res = await fetch(url, {
      ...options,
      headers
    });

    const body = await res.json().catch(() => null);

    if (!res.ok || !body?.success) {
      const err = new Error(body?.error?.message || `Request failed with status ${res.status}`);
      err.code = body?.error?.code || 'API_ERROR';
      err.details = body?.error?.details || null;
      err.statusCode = res.status;
      throw err;
    }

    return body.data;
  }

  /**
   * Authenticate with the single-owner backend flow.
   */
  async login(username, password) {
    const data = await this._apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });

    if (data?.token) {
      this.setAuthToken(data.token);
    }
    return data;
  }

  /**
   * Backend Session Operations
   */
  async createSession(title = 'New Neural Session') {
    return this._apiRequest('/sessions', {
      method: 'POST',
      body: JSON.stringify({ title })
    });
  }

  async getSessions() {
    return this._apiRequest('/sessions');
  }

  async getSession(id) {
    return this._apiRequest(`/sessions/${id}`);
  }

  async deleteSession(id) {
    return this._apiRequest(`/sessions/${id}`, {
      method: 'DELETE'
    });
  }

  /**
   * Action Confirmation & Cancellation Operations (Stage 2)
   */
  async confirmAction(actionId, confirmationToken, passedArgs = null) {
    return this._apiRequest(`/actions/${actionId}/confirm`, {
      method: 'POST',
      body: JSON.stringify({
        confirmationToken,
        arguments: passedArgs
      })
    });
  }

  async cancelAction(actionId, reason = 'Operator cancelled via dashboard') {
    return this._apiRequest(`/actions/${actionId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  }

  async getActions(sessionId = null) {
    const query = sessionId ? `?sessionId=${encodeURIComponent(sessionId)}` : '';
    return this._apiRequest(`/actions${query}`);
  }

  /**
   * Stage 4 Local Automation Agent Operations
   */
  async getAutomationStatus() {
    try {
      return await this._apiRequest('/automation/status');
    } catch (err) {
      return {
        online: false,
        status: 'offline',
        error: err.message
      };
    }
  }

  async getAutomationCapabilities() {
    try {
      return await this._apiRequest('/automation/capabilities');
    } catch (err) {
      return {
        online: false,
        capabilities: [],
        allowedApps: []
      };
    }
  }

  async executeAutomationAction(action, params = {}) {
    return this._apiRequest('/automation/execute', {
      method: 'POST',
      body: JSON.stringify({ action, params })
    });
  }

  /**
   * Stage 5 Real Device Connectors (Android ADB & Home Assistant)
   */
  async getDeviceSummary() {
    try {
      return await this._apiRequest('/devices/summary');
    } catch (err) {
      return {
        android: { agentOnline: false, adbAvailable: false, totalConnected: 0, devices: [] },
        homeAssistant: { configured: false, online: false, isSimulatedFixture: true, entities: { mediaPlayers: [], lights: [], switches: [] } }
      };
    }
  }

  async getAndroidDevices() {
    return this._apiRequest('/devices/android');
  }

  async executeAndroidAction(action, params = {}) {
    return this._apiRequest('/devices/android/action', {
      method: 'POST',
      body: JSON.stringify({ action, params })
    });
  }

  async getHassStatus() {
    return this._apiRequest('/devices/hass/status');
  }

  async getHassEntities(domain = null) {
    const q = domain ? `?domain=${encodeURIComponent(domain)}` : '';
    return this._apiRequest(`/devices/hass/entities${q}`);
  }

  async controlHassMedia({ entityId, query, action, value }) {
    return this._apiRequest('/devices/hass/media', {
      method: 'POST',
      body: JSON.stringify({ entityId, query, action, value })
    });
  }

  async controlHassLight({ entityId, query, action, brightness }) {
    return this._apiRequest('/devices/hass/light', {
      method: 'POST',
      body: JSON.stringify({ entityId, query, action, brightness })
    });
  }

  /**
   * Stage 6 Personal Knowledge & Document Indexing
   */
  async uploadKnowledgeDocument(file) {
    const formData = new FormData();
    formData.append('file', file);

    const token = this._getStoredToken();
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    else headers['X-API-Key'] = this.ownerApiKey;

    const res = await fetch(`${this.baseUrl}/knowledge/upload`, {
      method: 'POST',
      headers,
      body: formData
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(json.error?.message || `Upload failed with status ${res.status}`);
      err.code = json.error?.code || 'UPLOAD_FAILED';
      throw err;
    }
    return json.data;
  }

  async getKnowledgeDocuments() {
    try {
      const res = await this._apiRequest('/knowledge/documents');
      return res.documents || [];
    } catch (e) {
      return [];
    }
  }

  async deleteKnowledgeDocument(id) {
    return this._apiRequest(`/knowledge/documents/${id}`, { method: 'DELETE' });
  }

  async queryKnowledgeDocuments(queryText, topK = 4) {
    return this._apiRequest('/knowledge/query', {
      method: 'POST',
      body: JSON.stringify({ query: queryText, topK })
    });
  }

  /**
   * Stage 6 Personal Memories & Explicit Preferences
   */
  async getPersonalMemories(category = null, search = null) {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    const q = params.toString() ? `?${params.toString()}` : '';

    try {
      const res = await this._apiRequest(`/knowledge/memories${q}`);
      return res.memories || [];
    } catch (e) {
      return [];
    }
  }

  async createPersonalMemory(data) {
    return this._apiRequest('/knowledge/memories', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updatePersonalMemory(id, data) {
    return this._apiRequest(`/knowledge/memories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deletePersonalMemory(id) {
    return this._apiRequest(`/knowledge/memories/${id}`, { method: 'DELETE' });
  }

  /**
   * Stage 6 Reusable Workflows
   */
  async getWorkflows() {
    try {
      const res = await this._apiRequest('/workflows');
      return res.workflows || [];
    } catch (e) {
      return [];
    }
  }

  async createWorkflow(workflowData) {
    return this._apiRequest('/workflows', {
      method: 'POST',
      body: JSON.stringify(workflowData)
    });
  }

  async proposeWorkflow(id, params = {}) {
    const q = new URLSearchParams(params).toString();
    return this._apiRequest(`/workflows/${encodeURIComponent(id)}/propose${q ? `?${q}` : ''}`);
  }

  async runWorkflow(id, params = {}, confirmed = false) {
    return this._apiRequest(`/workflows/${encodeURIComponent(id)}/run`, {
      method: 'POST',
      body: JSON.stringify({ params, confirmed })
    });
  }

  async getWorkflowRuns(limit = 20) {
    try {
      const res = await this._apiRequest(`/workflows/runs?limit=${limit}`);
      return res.runs || [];
    } catch (e) {
      return [];
    }
  }

  async resumeWorkflowRun(runId, data = {}) {
    return this._apiRequest(`/workflows/runs/${encodeURIComponent(runId)}/resume`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async cancelWorkflowRun(runId) {
    return this._apiRequest(`/workflows/runs/${encodeURIComponent(runId)}/cancel`, {
      method: 'POST'
    });
  }

  /**
   * Stage 6 Activity Timeline
   */
  async getActivityTimeline(limit = 25) {
    try {
      const res = await this._apiRequest(`/activity/timeline?limit=${limit}`);
      return res.timeline || [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Send a message and handle the response.
   * If Demo Mode is active: generates realistic local streaming animation.
   * If Live Mode is active: dispatches to Node.js/Express backend via POST /api/chat.
   */
  sendMessageStream({
    prompt,
    sessionId = null,
    history = [],
    onStartThinking,
    onChunk,
    onComplete,
    onError
  }) {
    if (this.activeStreamAbort) {
      this.activeStreamAbort();
      this.activeStreamAbort = null;
    }

    let isCancelled = false;
    this.activeStreamAbort = () => {
      isCancelled = true;
    };

    // If live backend mode is selected
    if (!this.isDemoMode) {
      this._sendToLiveBackend({
        prompt,
        sessionId,
        onStartThinking,
        onChunk,
        onComplete,
        onError,
        isCancelled: () => isCancelled
      });
      return this.activeStreamAbort;
    }

    // --- Demo Mode: High-fidelity client simulator ---
    (async () => {
      try {
        if (onStartThinking) onStartThinking();

        const thinkingDelay = Math.floor(Math.random() * 250) + 400;
        await new Promise(res => setTimeout(res, thinkingDelay));

        if (isCancelled) return;

        const fullResponse = getSimulatedResponse(prompt);
        const words = fullResponse.split(' ');
        let accumulated = '';

        for (let i = 0; i < words.length; i++) {
          if (isCancelled) return;

          const word = words[i];
          accumulated += (i === 0 ? '' : ' ') + word;

          if (onChunk) onChunk(accumulated, word);

          let delay = 18 + Math.floor(Math.random() * 15);
          if (word.endsWith('.') || word.endsWith(':') || word.includes('\n')) {
            delay += 35;
          }

          await new Promise(res => setTimeout(res, delay));
        }

        if (isCancelled) return;

        const result = {
          role: 'assistant',
          content: accumulated,
          simulated: true,
          actions: [],
          timestamp: new Date().toISOString()
        };

        if (onComplete) onComplete(result);
      } catch (err) {
        if (!isCancelled && onError) {
          onError(err.message || 'Simulated streaming error');
        }
      } finally {
        this.activeStreamAbort = null;
      }
    })();

    return this.activeStreamAbort;
  }

  /**
   * Stage 2 Live Backend Dispatch (POST /api/chat with AI & Action Execution)
   */
  async _sendToLiveBackend({
    prompt,
    sessionId,
    onStartThinking,
    onChunk,
    onComplete,
    onError,
    isCancelled
  }) {
    try {
      if (onStartThinking) onStartThinking();

      // Ensure a valid session exists in the backend
      let targetSessionId = sessionId;
      if (!targetSessionId) {
        const newSession = await this.createSession('New Tactical Session');
        targetSessionId = newSession.id;
      }

      // Dispatch to Stage 2 POST /api/chat
      const result = await this._apiRequest('/chat', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: targetSessionId,
          message: prompt
        })
      });

      if (isCancelled()) return;

      const assistantMsg = result?.message || {
        role: 'assistant',
        content: 'NOVA core completed command synthesis.',
        timestamp: new Date().toISOString()
      };

      const actions = result?.actions || [];

      if (onChunk) {
        onChunk(assistantMsg.content, assistantMsg.content);
      }

      if (onComplete) {
        onComplete({
          ...assistantMsg,
          actions,
          simulated: false
        });
      }
    } catch (err) {
      if (isCancelled()) return;

      let displayMessage = err.message;
      if (err.code === 'USAGE_LIMIT_EXCEEDED') {
        displayMessage = `⚠️ Usage Rate Limit: ${err.message}`;
      } else if (err.code === 'MODEL_TIMEOUT') {
        displayMessage = `⏱️ Gateway Timeout: AI model request timed out. Please try again.`;
      } else if (err.code === 'DATABASE_UNAVAILABLE' || err.code === 'DATABASE_NOT_READY') {
        const setup = err.details?.setupGuide || 'Please verify MySQL configuration in backend/.env.';
        displayMessage = `Database Notice: ${err.message}\nSetup: ${setup}`;
      }

      if (onError) onError(displayMessage);
    } finally {
      this.activeStreamAbort = null;
    }
  }
}

export const api = new ApiAdapter();
