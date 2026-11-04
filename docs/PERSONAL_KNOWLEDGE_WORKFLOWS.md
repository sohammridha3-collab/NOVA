# NOVA Personal Knowledge & Reusable Workflows Architecture

This document specifies the technical design, data structures, retrieval algorithms, workflow state machines, and safety boundaries for Stage 6 of the **NOVA** Personal AI Command Centre.

---

## 1. Architectural Overview

The Stage 6 subsystem bridges persistent personal knowledge (unstructured document ingestion, semantically grounded passage retrieval, and explicit user memories) with deterministic, multi-step system automation (sequential workflows, parameter resolution, pause-on-consequence gates, and activity timelines).

```
                                  +------------------------------------+
                                  |     NOVA Frontend UI (Vite)        |
                                  |   Holographic Cognitive Command    |
                                  | (Docs, Memory, Workflow, Timeline) |
                                  +-----------------+------------------+
                                                    |  REST API / Auth Header
                                                    v
                                  +-----------------+------------------+
                                  |     NOVA Node.js Backend API       |
                                  |          (Port 3001)               |
                                  +---+----------------------------+---+
                                      |                            |
            +-------------------------+                            +-------------------------+
            |                                                                                |
            v                                                                                v
+-----------+-------------------------+                                  +-------------------+--------------------+
|  Personal Knowledge Subsystem       |                                  |   Autonomous Workflow Engine           |
|                                     |                                  |                                        |
| 1. Document Extraction & Chunking   |                                  | 1. Workflow Proposal & Step Validation |
|    - PDF (`pdf-parse` + page marks) |                                  | 2. Sequential Step Runner              |
|    - TXT & Markdown parser          |                                  | 3. Consequential Gate (`requiresConf`) |
|    - Dynamic sliding window chunker |                                  | 4. Cryptographic HMAC Token Binding    |
| 2. Replaceable Retrieval Layer      |                                  | 5. Fail-Safe Instant Abort             |
|    - `BaseRetriever` Interface      |                                  | 6. Unified Activity Timeline Stream    |
|    - `BM25KnowledgeRetriever`       |                                  +-------------------+--------------------+
|    - Pluggable Vector Adapter       |                                                      |
| 3. Explicit Memories Service        |                                                      v
|    - CRUD + Categorization          |                                  +-------------------+--------------------+
|    - MySQL + In-Memory Fallback     |                                  |     NOVA Tool Registry (Stage 2-6)     |
+-----------+-------------------------+                                  | - Local Host Agent (OS, Files, ADB)    |
            |                                                            | - Home Assistant IoT (TV, Lights)      |
            v                                                            | - Notes, Reminders, Knowledge, Memory  |
+-----------+-------------------------+                                  +----------------------------------------+
| Persistence Storage Layer           |
| - MySQL (`documents`, `chunks`,     |
|   `memories`, `workflows`, `runs`)  |
| - Local disk (`backend/data/docs/`) |
+-------------------------------------+
```

---

## 2. Personal Knowledge Pipeline

### A. Document Upload & Extraction
NOVA supports three validated file formats: **PDF (`.pdf`)**, **Plain Text (`.txt`)**, and **Markdown (`.md`)**.

1. **Upload Validation**: Enforces MIME validation, file extension check, and strict size limitation (`MAX_FILE_SIZE_MB = 25MB`).
2. **Persistent Storage**: Originals are saved to disk in `backend/data/documents/` using sanitised, collision-resistant filenames (`doc_<uuid>_<original_name>`).
3. **Page-Accurate Text Extraction (`documentExtractor.js`)**:
   - **PDF**: Employs `pdf-parse` with a custom page renderer to inject unambiguous synthetic page markers `[[NOVA_PAGE_N]]` at every physical page break.
   - **Markdown**: Parses document headers (`#`, `##`, `###`) to preserve logical section hierarchies and document structure.
   - **Plain Text**: Splits by natural paragraph boundaries with simulated pagination (~450 words/page) to provide page-indexed references.
4. **Sliding-Window Chunking**:
   - Configurable chunk size (`maxChunkSize = 600` chars) and overlap (`chunkOverlap = 100` chars).
   - Paragraph-boundary and sentence-boundary snapping prevents mid-sentence fragmentation.
   - Every chunk retains metadata: `chunkIndex`, `pageNumber`, `sectionTitle`, `documentId`, and `filename`.

### B. Replaceable Retrieval Layer (`retrievalService.js`)
NOVA abstracts retrieval behind the `BaseRetriever` contract, guaranteeing that changing the underlying search technology (e.g. from keyword to dense vector embeddings) requires zero edits to business logic, controllers, or tool registrations.

```javascript
class BaseRetriever {
  async indexDocument(docId, chunks) {}
  async removeDocument(docId) {}
  async search(query, options = {}) {}
}
```

#### Production Default: `BM25KnowledgeRetriever`
- **Scoring Function**: Implements Okapi BM25 scoring with parameters $k_1 = 1.2$ and $b = 0.75$:
  $$\text{Score}(D, Q) = \sum_{t \in Q} IDF(t) \cdot \frac{f(t, D) \cdot (k_1 + 1)}{f(t, D) + k_1 \cdot \left(1 - b + b \cdot \frac{|D|}{\text{avgdl}}\right)}$$
- **Inverted Index**: Builds an in-memory index mapping normalized tokens to posting lists with term frequencies.
- **Stop-Word Filtering**: Comprehensive English stop-word elimination prevents common query tokens (`is`, `what`, `the`, `of`, `under`) from producing false-positive document matches on unrelated general questions.
- **Exact-Phrase & Title Boosting**: Adds a scoring bonus (+1.5) for exact multi-token substring matches and document title matches (+0.5, applied only when content keywords match).

### C. Grounded Question Answering (`documentQaService.js`)
When querying personal knowledge, NOVA enforces explicit citation grounding:

> [!IMPORTANT]
> **Grounding Policy & Citation Contracts**
> - **Document-Supported Queries (`score >= 0.25`)**: Return `sourceType: 'document_supported'`, `isDocumentSupported: true`, exact cited passages, document filenames, and page numbers. Responses are prefixed with `[DOC-SUPPORTED: <filename>, Page <N>]`.
> - **General Knowledge Queries (`score < 0.25` or unindexed)**: Return `sourceType: 'general_knowledge'`, `isDocumentSupported: false`, and an empty citations array. The system never pretends a generic answer came from an indexed document.

---

## 3. Explicit Personal Memories (`memoryService.js`)

Unlike opaque model chat histories, NOVA provides **audited, user-controllable personal memories**:
- **Granular Categories**: `preference`, `fact`, `instruction`, `project`, `general`.
- **Full CRUD Controls**:
  - `POST /api/knowledge/memories`: Create memory with explicit text, category, and importance score (1–5).
  - `GET /api/knowledge/memories`: List and filter memories.
  - `PUT /api/knowledge/memories/:id`: Update memory content or category.
  - `DELETE /api/knowledge/memories/:id`: Delete memory permanently (protected tool action requiring explicit confirmation).
- **Searchable Index**: Keywords and category filters search active memories to supplement real-time LLM prompts.

---

## 4. Reusable Workflow Engine (`workflowEngine.js`)

The Autonomous Workflow Engine enables deterministic, multi-step routines constructed from existing registered tools across Stages 2–6.

### A. Built-in Workflow Templates
NOVA ships with pre-configured production workflows:

| Workflow ID | Title | Purpose | Steps |
|:---|:---|:---|:---|
| `start_study_mode` | Start Study Mode | Configures quiet study environment | 1. Query study notes<br>2. Set study reminder (+45m)<br>3. Dim room lights (35%)<br>4. Open workspace study notes |
| `start_coding_mode` | Start Coding Mode | Sets up developer environment | 1. Launch VS Code<br>2. Open GitHub URL<br>3. Set break reminder (+60m)<br>4. Query project memories |
| `system_audit_mode` | System Audit Mode | Inspects host OS & connected devices | 1. Get host OS metrics<br>2. List connected ADB devices<br>3. Check Home Assistant state |

### B. Custom Workflow Creation & Tool Validation
Users can define arbitrary workflows via `POST /api/workflows`. Each proposed step is strictly validated against the server-side `toolRegistry`:
- If an unknown tool is specified, creation fails with `400 UNRECOGNIZED_WORKFLOW_TOOL`.
- Tool arguments are validated against the tool's JSON schema before persisting.

### C. Sequential Execution & Fail-Safe Abort
Workflows execute in strict sequential order:
1. **Proposal (`/api/workflows/:id/propose`)**: Computes step parameters, evaluates confirmation requirements, and returns a preview without altering state.
2. **Execution (`/api/workflows/:id/run`)**: Runs steps sequentially. Each step status updates in real time: `pending` -> `running` -> `succeeded` or `failed`.
3. **Fail-Safe Abort**:
   > [!CAUTION]
   > If any step encounters an execution error (e.g. offline device, missing file, agent timeout), **execution halts immediately**. Subsequent steps are left in `pending` or marked `cancelled`. NOVA never cascades errors or executes subsequent steps on an unstable environment.

### D. Consequential Step Gates & HMAC Token Binding
When a workflow encounters a step marked `requiresConfirmation: true` (e.g. deleting files, clearing memories):
1. Execution pauses in `awaiting_confirmation` status.
2. The engine generates an HMAC-SHA256 signature binding `runId`, `stepIndex`, `toolName`, and exact `parameters`:
   $$\text{Token} = \text{HMAC-SHA256}_{K_{\text{secret}}}(\text{runId} + \text{stepIndex} + \text{toolName} + \text{JSON}(\text{params}))$$
3. The client must present this exact token to `POST /api/workflows/:id/resume`. If parameters or step indices have been tampered with, the call is rejected with `403 CONFIRMATION_TOKEN_INVALID`.

---

## 5. Activity Timeline & Cancellation (`activityTimelineService.js`)

The Unified Activity Timeline consolidates asynchronous system events into a single audit log:
- **Event Types**: `workflow_run`, `tool_execution`, `document_indexed`, `memory_saved`, `device_action`.
- **Live Filtering**: Supports filtering by status (`succeeded`, `failed`, `running`, `awaiting_confirmation`).
- **Cancellation Controls**: Any active workflow run or async task can be cancelled via `POST /api/activity/:id/cancel` or `POST /api/workflows/:id/cancel`.

---

## 6. API Reference

All endpoints require single-owner authentication (`X-API-Key` header or `apiKey` query param).

### Knowledge & Documents
| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/api/knowledge/documents/upload` | Multipart upload of `.pdf`, `.txt`, `.md` document |
| `GET` | `/api/knowledge/documents` | List all indexed documents with chunk and page stats |
| `GET` | `/api/knowledge/documents/:id` | Get document metadata and indexed chunk excerpts |
| `DELETE` | `/api/knowledge/documents/:id` | Delete document from disk, MySQL, and retrieval index |
| `POST` | `/api/knowledge/query` | Grounded search with citations (`query`, `topK`) |

### Personal Memories
| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/knowledge/memories` | List memories (supports `category` and `query` filters) |
| `POST` | `/api/knowledge/memories` | Create memory (`content`, `category`, `importance`) |
| `PUT` | `/api/knowledge/memories/:id` | Update memory content or category |
| `DELETE` | `/api/knowledge/memories/:id` | Permanently remove memory |

### Autonomous Workflows
| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/workflows` | List all available templates and custom workflows |
| `GET` | `/api/workflows/:id` | Get workflow definition and step sequence |
| `POST` | `/api/workflows` | Create custom validated workflow |
| `GET` | `/api/workflows/:id/propose` | Dry-run proposal showing resolved steps |
| `POST` | `/api/workflows/:id/run` | Execute workflow sequentially |
| `POST` | `/api/workflows/:id/resume` | Resume paused workflow with valid confirmation token |
| `POST` | `/api/workflows/:id/cancel` | Cancel active workflow run |
| `GET` | `/api/workflows/runs/:runId` | Inspect run status and individual step logs |

### Activity Timeline
| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/activity` | Unified chronological activity feed (`limit`, `type`, `status`) |
| `POST` | `/api/activity/:id/cancel` | Cancel running activity item |

---

## 7. Genuine Hardware vs. Simulated Fixtures

To ensure transparency and system integrity, NOVA maintains strict distinctions between live host hardware and simulated fallbacks:

| Feature / Subsystem | Physical / Production Mode | Fallback / Simulated Mode |
|:---|:---|:---|
| **Document Storage & Indexing** | **GENUINE**: Files stored in `backend/data/documents/`; text parsed with `pdf-parse`; BM25 inverted index computed in-memory; metadata stored in MySQL. | In-memory document & chunk map if MySQL is unconfigured. |
| **Personal Memories** | **GENUINE**: Stored in MySQL `memories` table with category indexing. | In-memory array fallback if MySQL is offline. |
| **Workflow Engine** | **GENUINE**: Real sequential execution engine invoking registered Stage 2–6 tools. | Consequential steps simulate paused gates if tools are mocks. |
| **Windows Local Agent** | **GENUINE**: Dispatches to `http://127.0.0.1:3002`; launches real executables; reads host CPU/RAM; traverses real sandbox directories. | Offline state indicator if agent daemon is stopped. |
| **Android ADB** | **GENUINE**: Dispatches `adb` commands to USB/Wi-Fi connected devices listed in `adb devices`. | `[SIMULATED FIXTURE]` when no phone is connected or authorized. |
| **Home Assistant IoT** | **GENUINE**: REST / WebSocket API calls to configured `HASS_BASE_URL` with token. | Mock entities (`light.living_room_lights`, `media_player.living_room_tv`) for offline environments. |

---

## 8. Verification & Test Suite

NOVA Stage 6 includes exhaustive automated test suites covering document extraction, citation grounding, BM25 stop-word filtering, memory CRUD, workflow step validation, fail-safe abortion, and cryptographic token verification:

1. **Knowledge & Document QA Suite (`backend/tests/knowledge.test.js`)**: 12/12 passing.
2. **Workflows & Consequential Gates Suite (`backend/tests/workflows.test.js`)**: 11/11 passing.
3. **End-to-End System Master Suite (`npm run test:all`)**: **102/102 passing**:
   - 22 Windows Local Automation Agent tests.
   - 73 Backend API & integration tests (Stages 1–6).
   - 7 Frontend smoke & visual rendering tests.
