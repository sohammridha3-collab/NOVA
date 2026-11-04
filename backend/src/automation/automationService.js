/**
 * NOVA Backend — Local Automation Agent Client Service
 * Dispatches authenticated calls to the local agent running on 127.0.0.1:3002.
 * Strictly adheres to server-side pairing, capability discovery, and timeout management.
 */

import { config } from '../config/env.js';

class AutomationService {
  constructor() {
    this.secret = config.automation?.pairingSecret || 'nova_agent_pairing_secret_99a8b7c6';
    this.timeoutMs = config.automation?.timeoutMs || 15000;
  }

  getBaseUrl() {
    return process.env.LOCAL_AGENT_URL || config.automation?.agentUrl || 'http://127.0.0.1:3002';
  }

  /**
   * Internal HTTP request helper with pairing authentication & timeout
   */
  async _request(endpoint, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    const url = `${this.getBaseUrl()}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.secret}`,
      ...(options.headers || {})
    };

    try {
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const err = new Error(data.error?.message || `Automation agent returned status ${response.status}`);
        err.code = data.error?.code || 'AUTOMATION_AGENT_ERROR';
        err.statusCode = response.status;
        err.details = data.error;
        throw err;
      }

      return data;
    } catch (err) {
      clearTimeout(timeoutId);

      if (err.name === 'AbortError') {
        const timeoutErr = new Error(`Local automation request timed out after ${this.timeoutMs}ms.`);
        timeoutErr.code = 'AUTOMATION_TIMEOUT';
        timeoutErr.statusCode = 504;
        throw timeoutErr;
      }

      if (err.cause?.code === 'ECONNREFUSED' || err.code === 'ECONNREFUSED' || err.message?.includes('fetch failed')) {
        const offlineErr = new Error('Local automation agent is offline or unreachable on 127.0.0.1:3002. Ensure it is started via "npm run agent:start".');
        offlineErr.code = 'AGENT_OFFLINE';
        offlineErr.statusCode = 503;
        throw offlineErr;
      }

      throw err;
    }
  }

  /**
   * Get agent status
   */
  async getStatus() {
    try {
      const res = await this._request('/status');
      return {
        online: true,
        ...res.data
      };
    } catch (err) {
      return {
        online: false,
        status: 'offline',
        error: err.message,
        code: err.code || 'AGENT_OFFLINE'
      };
    }
  }

  /**
   * Get agent capabilities and allowed app whitelist
   */
  async getCapabilities() {
    try {
      const res = await this._request('/capabilities');
      return {
        online: true,
        ...res.data
      };
    } catch (err) {
      return {
        online: false,
        capabilities: [],
        allowedApps: [],
        error: err.message
      };
    }
  }

  /**
   * Execute action on local agent
   */
  async execute(action, params = {}) {
    const res = await this._request('/execute', {
      method: 'POST',
      body: { action, params }
    });
    return res.data;
  }
}

export const automationService = new AutomationService();

