import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createApp } from '../backend/src/app.js';
import { config } from '../backend/src/config/env.js';

const values = new Map();
globalThis.localStorage = {
  getItem: key => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, String(value)),
  removeItem: key => values.delete(key)
};
const { ApiAdapter } = await import('../src/services/apiAdapter.js');
const server = createApp().listen(0, '127.0.0.1');
await once(server, 'listening');
const client = new ApiAdapter();
client.apiBase = 'http://127.0.0.1:' + server.address().port + '/api';
try {
  await client.login(config.auth.ownerUsername, config.auth.ownerPassword);
  client.setDemoMode(false);
  const localId = 'session_integration_test';
  const send = () => new Promise((resolve, reject) => client.sendMessageStream({
    prompt: 'What time is it?', sessionId: localId, onComplete: resolve, onError: reject
  }));
  assert.ok((await send()).content);
  const remoteId = localStorage.getItem('nova_backend_session:' + localId);
  assert.ok(remoteId);
  assert.ok((await send()).content);
  assert.equal(localStorage.getItem('nova_backend_session:' + localId), remoteId);
  const file = new File(['Original test document for the API adapter.'], 'adapter-test.txt', { type: 'text/plain' });
  const uploaded = await client.uploadKnowledgeDocument(file);
  assert.ok(uploaded.documentId);
  await client.deleteKnowledgeDocument(uploaded.documentId);
  await client.deleteSession(remoteId);
  console.log('PASS: owner login, two live turns, stable session and document upload/delete');
} finally {
  server.close();
}
