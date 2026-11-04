/**
 * NOVA — Modular API Adapter Service
 * Handles AI request communication.
 * In this stage, it provides a high-fidelity local streaming simulator.
 * Cleanly designed to be replaced with a live Node.js/Express endpoint:
 *   fetch('/api/chat', { ... }) or EventSource('/api/chat/stream')
 */

import { getSimulatedResponse } from './mockData.js';

export class ApiAdapter {
  constructor() {
    this.isDemoMode = true;
    this.backendEndpoint = '/api/chat'; // Placeholder for future Node.js/Express server
    this.activeStreamAbort = null;
  }

  /**
   * Send a user prompt and stream the assistant's reply chunk by chunk.
   * 
   * @param {Object} options
   * @param {string} options.prompt - The user's input text
   * @param {Array} options.history - Prior messages in current conversation
   * @param {Function} options.onStartThinking - Triggered when processing starts
   * @param {Function} options.onChunk - Called with (accumulatedText, newChunk) as chunks arrive
   * @param {Function} options.onComplete - Called with the final response payload
   * @param {Function} options.onError - Called if an error occurs
   * @returns {Function} cancel - Function to abort the active stream
   */
  sendMessageStream({
    prompt,
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

    // If a live backend is configured in the future, dispatch to real API
    if (!this.isDemoMode) {
      this._streamFromLiveBackend(prompt, history, onStartThinking, onChunk, onComplete, onError, () => isCancelled);
      return this.activeStreamAbort;
    }

    // --- High-fidelity simulated stream ---
    (async () => {
      try {
        if (onStartThinking) onStartThinking();

        // 1. Realistic initial thinking latency (500ms - 850ms)
        const thinkingDelay = Math.floor(Math.random() * 350) + 500;
        await new Promise(res => setTimeout(res, thinkingDelay));

        if (isCancelled) return;

        // 2. Fetch full simulated response
        const fullResponse = getSimulatedResponse(prompt);

        // 3. Break into word/token chunks for realistic typing streaming
        const words = fullResponse.split(' ');
        let accumulated = '';

        for (let i = 0; i < words.length; i++) {
          if (isCancelled) return;

          const word = words[i];
          accumulated += (i === 0 ? '' : ' ') + word;

          if (onChunk) {
            onChunk(accumulated, word);
          }

          // Varied typing delay (punctuation pauses slightly longer)
          let delay = 22 + Math.floor(Math.random() * 20);
          if (word.endsWith('.') || word.endsWith(':') || word.includes('\n')) {
            delay += 40;
          }

          await new Promise(res => setTimeout(res, delay));
        }

        if (isCancelled) return;

        const result = {
          role: 'assistant',
          content: accumulated,
          simulated: true,
          timestamp: new Date().toISOString()
        };

        if (onComplete) {
          onComplete(result);
        }
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
   * Future Backend Integration Helper
   * When Node.js/Express backend is ready, set isDemoMode = false
   */
  async _streamFromLiveBackend(prompt, history, onStartThinking, onChunk, onComplete, onError, isCancelled) {
    try {
      if (onStartThinking) onStartThinking();

      const response = await fetch(this.backendEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, history })
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulated = '';

      while (true) {
        if (isCancelled()) {
          reader.cancel();
          return;
        }

        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        if (onChunk) onChunk(accumulated, chunk);
      }

      if (onComplete) {
        onComplete({
          role: 'assistant',
          content: accumulated,
          simulated: false,
          timestamp: new Date().toISOString()
        });
      }
    } catch (err) {
      if (!isCancelled() && onError) onError(err.message);
    }
  }
}

export const api = new ApiAdapter();

