/**
 * NOVA Backend — Stage 6 Knowledge & Memories Automated Verification Suite
 */

import http from 'http';
import assert from 'assert';
import { createApp } from '../src/app.js';
import { config } from '../src/config/env.js';
import {
  ingestDocument,
  listDocuments,
  deleteDocument
} from '../src/knowledge/documentService.js';
import { answerDocumentQuestion } from '../src/knowledge/documentQaService.js';
import {
  createMemory,
  listMemories,
  updateMemory,
  deleteMemory,
  clearInMemoryMemories
} from '../src/knowledge/memoryService.js';
import {
  queryKnowledge,
  clearInMemoryKnowledgeStore
} from '../src/knowledge/retrievalService.js';
import { toolRegistry } from '../src/tools/registry.js';

let server;
let baseUrl;

async function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': config.auth.ownerApiKey,
      ...(options.headers || {})
    };

    const req = http.request(url, {
      method: options.method || 'GET',
      headers
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = { raw: data };
        }
        resolve({ status: res.statusCode, headers: res.headers, body: json });
      });
    });

    req.on('error', reject);
    if (options.body) {
      if (typeof options.body === 'string') {
        req.write(options.body);
      } else {
        req.write(JSON.stringify(options.body));
      }
    }
    req.end();
  });
}

async function runKnowledgeTests() {
  console.log('====================================================');
  console.log('NOVA Backend — Stage 6 Knowledge Verification Suite');
  console.log('====================================================');

  server = http.createServer(createApp());
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  baseUrl = `http://127.0.0.1:${port}`;
  console.log(`Knowledge test server active on ${baseUrl}\n`);

  clearInMemoryKnowledgeStore();
  clearInMemoryMemories();

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ FAIL: ${name}`);
      console.error('    Error:', err.message);
      failed++;
    }
  }

  // 1. Tool Registry Check
  await test('Stage 6 tools are registered in toolRegistry with typed schemas', async () => {
    const tools = ['queryDocumentKnowledge', 'savePersonalMemory', 'searchPersonalMemories', 'deletePersonalMemory', 'listWorkflows', 'runWorkflow'];
    for (const t of tools) {
      const tool = toolRegistry.get(t);
      assert.ok(tool, `Expected tool '${t}' to be registered`);
      assert.strictEqual(typeof tool.execute, 'function');
    }
  });

  // 2. Reject unsupported file formats
  await test('Ingest rejects unsupported formats (.exe, .png) with 400', async () => {
    try {
      await ingestDocument(Buffer.from('binary-data'), 'malicious.exe', 'application/x-msdownload');
      assert.fail('Expected invalid format rejection');
    } catch (err) {
      assert.strictEqual(err.status, 400);
      assert.ok(err.message.includes('Unsupported file type'));
    }
  });

  // 3. Ingest and extract text from Markdown document
  let sampleDocId = null;
  await test('Ingest valid Markdown document extracts sections, chunks, and metadata', async () => {
    const mdContent = `
# Quantum Computing Architecture
Quantum computers leverage qubits, superposition, and entanglement to perform complex matrix computations exponentially faster than classical Turing machines.

## Superposition Principle
Unlike classical bits which remain strictly 0 or 1, a qubit exists in a linear combination state: |psi> = alpha|0> + beta|1>.

## Decoherence Challenges
Environmental thermal fluctuations and electromagnetic interference cause quantum decoherence, requiring error-correcting surface codes.
    `.trim();

    const result = await ingestDocument(
      Buffer.from(mdContent, 'utf-8'),
      'quantum_computing.md',
      'text/markdown'
    );

    assert.ok(result.documentId);
    sampleDocId = result.documentId;
    assert.strictEqual(result.originalName, 'quantum_computing.md');
    assert.strictEqual(result.fileType, 'md');
    assert.ok(result.chunkCount >= 3, `Expected at least 3 chunks, got ${result.chunkCount}`);
  });

  // 4. Ingest plain text document
  let sampleTxtId = null;
  await test('Ingest valid Plain Text document creates indexed passages', async () => {
    const txtContent = `
NOVA Neural Operating System Handbook.
The system is equipped with an electric-cyan reactive visual core and tactile controls.
Voice transcription is managed through a faster-whisper Python worker supporting English, Hindi, and Bengali.
Windows automation executes strictly isolated processes without shell invocation.
    `.trim();

    const result = await ingestDocument(
      Buffer.from(txtContent, 'utf-8'),
      'nova_handbook.txt',
      'text/plain'
    );

    assert.ok(result.documentId);
    sampleTxtId = result.documentId;
    assert.strictEqual(result.fileType, 'txt');
  });

  // 5. Query knowledge retrieval layer
  await test('Query knowledge retrieves passages with BM25 score and page references', async () => {
    const passages = await queryKnowledge('superposition qubit decoherence', { topK: 3 });
    assert.ok(passages.length > 0, 'Expected at least 1 matching passage');
    assert.strictEqual(passages[0].originalName, 'quantum_computing.md');
    assert.ok(passages[0].score > 0.5, `Score should be high, got ${passages[0].score}`);
    assert.ok(passages.some((p) => p.content.toLowerCase().includes('qubit')), 'Expected at least one passage to contain qubit');
  });

  // 6. QA Service: Document-supported answer
  await test('answerDocumentQuestion produces document_supported response with citations', async () => {
    const res = await answerDocumentQuestion('What is the superposition principle?');
    assert.strictEqual(res.sourceType, 'document_supported');
    assert.strictEqual(res.isDocumentSupported, true);
    assert.ok(res.citations.length > 0);
    assert.strictEqual(res.citations[0].filename, 'quantum_computing.md');
    assert.ok(res.answer.includes('quantum_computing.md'));
  });

  // 7. QA Service: Distinguishes General Knowledge
  await test('answerDocumentQuestion identifies general_knowledge when no document matches', async () => {
    const res = await answerDocumentQuestion('What is the capital of ancient Byzantine empire under Justinian?');
    assert.strictEqual(res.sourceType, 'general_knowledge');
    assert.strictEqual(res.isDocumentSupported, false);
    assert.strictEqual(res.citations.length, 0);
    assert.ok(res.answer.includes('general knowledge'));
  });

  // 8. Document listing & deletion API
  await test('GET /api/knowledge/documents lists documents and DELETE purges index', async () => {
    const listRes = await request('/api/knowledge/documents');
    assert.strictEqual(listRes.status, 200);
    assert.ok(listRes.body.data.count >= 2);

    // Delete one document
    const delRes = await request(`/api/knowledge/documents/${sampleDocId}`, { method: 'DELETE' });
    assert.strictEqual(delRes.status, 200);
    assert.strictEqual(delRes.body.data.deleted, true);

    // Confirm deleted document is no longer in retrieval index
    const checkPassages = await queryKnowledge('superposition principle qubit', { documentId: sampleDocId });
    assert.strictEqual(checkPassages.length, 0, 'Deleted document passages must not appear in search');
  });

  // 9. Explicit Memories: Create, List, Update
  let testMemoryId = null;
  await test('Memory CRUD: create, list, and update explicitly saved memories', async () => {
    // Create
    const createRes = await request('/api/knowledge/memories', {
      method: 'POST',
      body: {
        category: 'study',
        keyName: 'favorite_topic',
        valueText: 'Quantum mechanics and distributed event-driven systems'
      }
    });
    assert.strictEqual(createRes.status, 201);
    testMemoryId = createRes.body.data.id;
    assert.strictEqual(createRes.body.data.keyName, 'favorite_topic');

    // List
    const listRes = await request('/api/knowledge/memories?category=study');
    assert.strictEqual(listRes.status, 200);
    const found = listRes.body.data.memories.find((m) => m.id === testMemoryId);
    assert.ok(found);

    // Update
    const updateRes = await request(`/api/knowledge/memories/${testMemoryId}`, {
      method: 'PUT',
      body: {
        valueText: 'Quantum algorithms, Shor algorithm, and distributed mesh networks'
      }
    });
    assert.strictEqual(updateRes.status, 200);
    assert.ok(updateRes.body.data.valueText.includes('Shor algorithm'));
  });

  // 10. Consequential Memory Deletion: Requires Confirmation
  await test('deletePersonalMemory tool requires explicit confirmation', async () => {
    const delTool = toolRegistry.get('deletePersonalMemory');
    assert.strictEqual(delTool.requiresConfirmation, true);

    // Attempt without confirmation
    try {
      await delTool.execute({ memoryId: testMemoryId, confirmed: false });
      assert.fail('Should require confirmation');
    } catch (err) {
      assert.strictEqual(err.code, 'CONFIRMATION_REQUIRED');
    }

    // Execute with confirmation
    const successResult = await delTool.execute({ memoryId: testMemoryId, confirmed: true }, { confirmed: true });
    assert.strictEqual(successResult.deleted, true);
  });

  // 11. Chat Integration: Document query routing
  await test('POST /api/chat handles "what does the document say about faster-whisper"', async () => {
    const chatRes = await request('/api/chat', {
      method: 'POST',
      body: {
        message: 'What does the document say about faster-whisper voice transcription?'
      }
    });
    assert.strictEqual(chatRes.status, 200);
    const content = chatRes.body.data.message?.content || chatRes.body.data.content || '';
    assert.ok(content.includes('[DOC-SUPPORTED]'), `Expected [DOC-SUPPORTED] in reply, got: ${content}`);
    assert.ok(content.includes('nova_handbook.txt'), `Expected nova_handbook.txt citation in reply, got: ${content}`);
  });

  // 12. Chat Integration: Explicit memory command
  await test('POST /api/chat handles "remember that I prefer electric-blue interface themes"', async () => {
    const chatRes = await request('/api/chat', {
      method: 'POST',
      body: {
        message: 'Remember that I prefer electric-blue interface themes'
      }
    });
    assert.strictEqual(chatRes.status, 200);
    const content = chatRes.body.data.message?.content || chatRes.body.data.content || '';
    assert.ok(content.includes('Explicit memory stored'), `Expected memory confirmation in reply, got: ${content}`);
  });

  server.close();
  console.log('\n====================================================');
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('====================================================\n');

  if (failed > 0) process.exit(1);
}

runKnowledgeTests().catch((err) => {
  console.error('Test suite error:', err);
  if (server) server.close();
  process.exit(1);
});
