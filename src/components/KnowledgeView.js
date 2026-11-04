/**
 * NOVA — Personal Knowledge & Reusable Workflows Component (Stage 6)
 *
 * Implements:
 * - Document Library with drag-and-drop / file upload for PDF, TXT, and Markdown
 * - Replaceable retrieval query sandbox displaying citations (filename, page) and
 *   distinguishing [DOC-SUPPORTED] answers from [GENERAL-KNOWLEDGE]
 * - Personal Memories CRUD manager (category filter, explicit creation, update, delete)
 * - Named Reusable Workflows ("Start study mode", "Start coding mode", "System audit")
 *   with sequential step visualizer, fail-safe abort, and confirmation gating
 * - Unified chronological Activity Timeline with live cancel controls
 */

import { api } from '../services/apiAdapter.js';
import { toast } from './Toast.js';
import { ICONS } from '../utils/icons.js';

export class KnowledgeView {
  constructor({ container, onActivityLogged }) {
    this.container = container;
    this.onActivityLogged = onActivityLogged || (() => {});

    this.activeTab = 'docs'; // 'docs' | 'memories' | 'workflows' | 'timeline'
    this.documents = [];
    this.memories = [];
    this.workflows = [];
    this.timeline = [];
    this.activeWorkflowRun = null;
    this.isQuerying = false;

    this.init();
  }

  init() {
    this._renderLayout();
    this._bindEvents();
    this.refresh();
  }

  _renderLayout() {
    this.container.innerHTML = `
      <div class="knowledge-view-wrapper">
        <!-- Holographic Section Header -->
        <div class="knowledge-header">
          <div class="knowledge-title-wrap">
            <span class="panel-bracket">[</span>
            <span class="panel-tag">COGNITIVE ARCHIVE</span>
            <span class="knowledge-main-title">PERSONAL KNOWLEDGE & WORKFLOWS</span>
            <span class="panel-bracket">]</span>
          </div>
          <div class="knowledge-header-actions">
            <button type="button" class="btn-holo-sm" id="btnRefreshKnowledge" title="Sync Knowledge & Workflows">
              ${ICONS.refresh}
              <span>Sync Archive</span>
            </button>
          </div>
        </div>

        <!-- Subsystem Tabs -->
        <div class="knowledge-tabs-nav">
          <button type="button" class="knowledge-tab-btn active" data-tab="docs">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            <span>Document Library</span>
          </button>
          <button type="button" class="knowledge-tab-btn" data-tab="memories">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>Personal Memories</span>
          </button>
          <button type="button" class="knowledge-tab-btn" data-tab="workflows">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            <span>Reusable Workflows</span>
          </button>
          <button type="button" class="knowledge-tab-btn" data-tab="timeline">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>Activity Timeline</span>
          </button>
        </div>

        <!-- Tab 1: Document Library & Grounded QA -->
        <div class="knowledge-tab-content active" id="tabContentDocs">
          <div class="knowledge-grid">
            <!-- Left: Document Ingestion & Inventory -->
            <div class="knowledge-panel upload-panel">
              <div class="panel-subhead">
                <span class="telemetry-label">INGESTION GATE</span>
                <span class="telemetry-badge">PDF • TXT • MD (Max 25MB)</span>
              </div>

              <!-- Drag & Drop Zone -->
              <div class="drop-zone" id="docDropZone">
                <input type="file" id="docFileInput" accept=".pdf,.txt,.md" style="display:none;" />
                <div class="drop-icon">
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <div class="drop-prompt">
                  <strong>Click or Drag & Drop</strong>
                  <span>Upload validated documents for neural passage indexing</span>
                </div>
              </div>

              <!-- Document List -->
              <div class="doc-list-head">
                <span class="telemetry-label">INDEXED ARCHIVES</span>
                <span class="doc-count-badge" id="docCountBadge">0 files</span>
              </div>
              <div class="doc-list-scroll" id="docListContainer">
                <div class="doc-empty-state">No personal documents indexed yet. Upload PDF, TXT, or MD files.</div>
              </div>
            </div>

            <!-- Right: Document QA & Citation Inspector -->
            <div class="knowledge-panel qa-panel">
              <div class="panel-subhead">
                <span class="telemetry-label">DOCUMENT RETRIEVAL & CITATION ENGINE</span>
                <span class="telemetry-badge" id="sourceTypePill">AWAITING QUERY</span>
              </div>

              <div class="qa-input-wrap">
                <input type="text" id="qaQueryInput" class="holo-input" placeholder="Ask a question about your indexed personal documents..." />
                <button type="button" class="btn-holo-primary" id="btnRunQuery">
                  <span>Retrieve</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>

              <div class="qa-results-container" id="qaResultsContainer">
                <div class="qa-placeholder">
                  <p>Ask a question above to test grounded passage retrieval with filename and page citations.</p>
                  <p class="qa-hint">Answers will explicitly differentiate between <strong>[DOC-SUPPORTED]</strong> and <strong>[GENERAL-KNOWLEDGE]</strong>.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 2: Personal Memories & Explicit Preferences -->
        <div class="knowledge-tab-content" id="tabContentMemories">
          <div class="knowledge-grid">
            <!-- Left: Add Memory Form -->
            <div class="knowledge-panel">
              <div class="panel-subhead">
                <span class="telemetry-label">EXPLICIT MEMORY CAPTURE</span>
                <span class="telemetry-badge">PERSISTENT</span>
              </div>
              <form id="formAddMemory" class="holo-form">
                <div class="form-group">
                  <label>Category</label>
                  <select id="memCategory" class="holo-select">
                    <option value="general">General</option>
                    <option value="study">Study</option>
                    <option value="work">Work</option>
                    <option value="preference">Preference</option>
                    <option value="fact">Personal Fact</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Topic / Key</label>
                  <input type="text" id="memKey" class="holo-input" placeholder="e.g. coding_editor, study_goal" required />
                </div>
                <div class="form-group">
                  <label>Memory Value / Instruction</label>
                  <textarea id="memValue" class="holo-textarea" rows="3" placeholder="Explicit preference or fact for NOVA to remember..." required></textarea>
                </div>
                <button type="submit" class="btn-holo-primary" id="btnSaveMemory">
                  <span>Remember Fact</span>
                </button>
              </form>
            </div>

            <!-- Right: Stored Memories -->
            <div class="knowledge-panel">
              <div class="panel-subhead">
                <span class="telemetry-label">ACTIVE MEMORIES INVENTORY</span>
                <span class="telemetry-badge" id="memoryCountBadge">0 memories</span>
              </div>
              <div class="memory-filter-pills" id="memoryCategoryFilters">
                <button type="button" class="filter-pill active" data-cat="all">ALL</button>
                <button type="button" class="filter-pill" data-cat="study">STUDY</button>
                <button type="button" class="filter-pill" data-cat="work">WORK</button>
                <button type="button" class="filter-pill" data-cat="preference">PREFERENCES</button>
                <button type="button" class="filter-pill" data-cat="fact">FACTS</button>
              </div>
              <div class="memories-scroll" id="memoriesContainer">
                <div class="doc-empty-state">No explicit memories stored yet.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 3: Reusable Workflows -->
        <div class="knowledge-tab-content" id="tabContentWorkflows">
          <div class="workflows-header-panel">
            <div class="panel-subhead">
              <span class="telemetry-label">WORKFLOW EXECUTION PIPELINE</span>
              <span class="telemetry-badge">FAIL-SAFE • SEQUENTIAL • CONFIRMATION-GATED</span>
            </div>
            <p class="section-desc">
              Execute multi-step tactical automation workflows across local processes, physical Android devices, and smart home appliances. If any step fails, execution halts safely immediately.
            </p>
          </div>

          <!-- Active Run Status Banner (If running or paused) -->
          <div class="workflow-active-banner hidden" id="workflowActiveBanner"></div>

          <!-- Workflow Cards Grid -->
          <div class="workflows-cards-grid" id="workflowCardsGrid"></div>
        </div>

        <!-- Tab 4: Activity Timeline -->
        <div class="knowledge-tab-content" id="tabContentTimeline">
          <div class="timeline-header-panel">
            <div class="panel-subhead">
              <span class="telemetry-label">AUDITED ACTIVITY STREAM</span>
              <span class="telemetry-badge" id="timelineCountBadge">0 events</span>
            </div>
          </div>
          <div class="timeline-scroll-container" id="timelineScrollContainer">
            <div class="doc-empty-state">No activity events recorded yet.</div>
          </div>
        </div>
      </div>
    `;
  }

  _bindEvents() {
    // Refresh button
    const btnRefresh = this.container.querySelector('#btnRefreshKnowledge');
    if (btnRefresh) btnRefresh.addEventListener('click', () => this.refresh());

    // Tabs switching
    const tabBtns = this.container.querySelectorAll('.knowledge-tab-btn');
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeTab = btn.dataset.tab;

        this.container.querySelectorAll('.knowledge-tab-content').forEach((c) => c.classList.remove('active'));
        const target = this.container.querySelector(`#tabContent${btn.dataset.tab.charAt(0).toUpperCase() + btn.dataset.tab.slice(1)}`);
        if (target) target.classList.add('active');
      });
    });

    // File Drop Zone & Input
    const dropZone = this.container.querySelector('#docDropZone');
    const fileInput = this.container.querySelector('#docFileInput');
    if (dropZone && fileInput) {
      dropZone.addEventListener('click', () => fileInput.click());

      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
      });
      dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files?.length > 0) {
          this._handleFileUpload(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener('change', () => {
        if (fileInput.files?.length > 0) {
          this._handleFileUpload(fileInput.files[0]);
          fileInput.value = '';
        }
      });
    }

    // QA Query Execution
    const btnRunQuery = this.container.querySelector('#btnRunQuery');
    const qaQueryInput = this.container.querySelector('#qaQueryInput');
    if (btnRunQuery && qaQueryInput) {
      const doQuery = () => this._handleKnowledgeQuery(qaQueryInput.value);
      btnRunQuery.addEventListener('click', doQuery);
      qaQueryInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') doQuery();
      });
    }

    // Save Memory Form
    const formAddMemory = this.container.querySelector('#formAddMemory');
    if (formAddMemory) {
      formAddMemory.addEventListener('submit', async (e) => {
        e.preventDefault();
        const cat = this.container.querySelector('#memCategory')?.value || 'general';
        const key = this.container.querySelector('#memKey')?.value || '';
        const val = this.container.querySelector('#memValue')?.value || '';
        if (!key.trim() || !val.trim()) return;

        try {
          await api.createPersonalMemory({ category: cat, keyName: key.trim(), valueText: val.trim() });
          toast.success(`Memory '${key}' saved.`);
          this.container.querySelector('#memKey').value = '';
          this.container.querySelector('#memValue').value = '';
          await this._loadMemories();
        } catch (err) {
          toast.error(`Failed to save memory: ${err.message}`);
        }
      });
    }

    // Category filter pills
    const filterPills = this.container.querySelectorAll('.filter-pill');
    filterPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        filterPills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        const cat = pill.dataset.cat === 'all' ? null : pill.dataset.cat;
        this._loadMemories(cat);
      });
    });
  }

  async refresh() {
    await Promise.all([
      this._loadDocuments(),
      this._loadMemories(),
      this._loadWorkflows(),
      this._loadTimeline()
    ]);
  }

  async _handleFileUpload(file) {
    if (!file) return;
    const allowed = ['.pdf', '.txt', '.md'];
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowed.includes(ext)) {
      toast.error(`Unsupported format '${ext}'. Allowed: .pdf, .txt, .md`);
      return;
    }

    try {
      toast.info(`Indexing document: ${file.name}...`);
      const res = await api.uploadKnowledgeDocument(file);
      toast.success(`Indexed '${file.name}' (${res.chunkCount} passages, ${res.pageCount} pages).`);
      this.onActivityLogged('DOCUMENT_INGESTED', { filename: file.name, chunks: res.chunkCount });
      await this._loadDocuments();
    } catch (err) {
      toast.error(`Upload failed: ${err.message}`);
    }
  }

  async _loadDocuments() {
    try {
      this.documents = await api.getKnowledgeDocuments();
      this._renderDocuments();
    } catch (err) {
      console.warn('Failed to load documents:', err);
    }
  }

  _renderDocuments() {
    const badge = this.container.querySelector('#docCountBadge');
    if (badge) badge.textContent = `${this.documents.length} file(s)`;

    const list = this.container.querySelector('#docListContainer');
    if (!list) return;

    if (this.documents.length === 0) {
      list.innerHTML = `<div class="doc-empty-state">No personal documents indexed yet. Upload PDF, TXT, or MD files above.</div>`;
      return;
    }

    list.innerHTML = this.documents
      .map(
        (d) => `
        <div class="doc-card" data-id="${d.id}">
          <div class="doc-card-info">
            <span class="doc-type-pill ${d.fileType}">${d.fileType.toUpperCase()}</span>
            <div class="doc-name-wrap">
              <span class="doc-name" title="${d.originalName}">${d.originalName}</span>
              <span class="doc-meta-sub">${d.pageCount} page(s) • ${d.chunkCount} chunks • ${(d.fileSize / 1024).toFixed(1)} KB</span>
            </div>
          </div>
          <button type="button" class="btn-doc-delete" title="Purge from knowledge index" data-del-id="${d.id}">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      `
      )
      .join('');

    // Attach delete listeners
    list.querySelectorAll('.btn-doc-delete').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const docId = btn.dataset.delId;
        if (!confirm('Are you sure you want to permanently delete this document and remove it from the knowledge index?')) return;
        try {
          await api.deleteKnowledgeDocument(docId);
          toast.success('Document deleted and purged from index.');
          await this._loadDocuments();
        } catch (err) {
          toast.error(`Delete failed: ${err.message}`);
        }
      });
    });
  }

  async _handleKnowledgeQuery(queryText) {
    if (!queryText || !queryText.trim()) return;
    const resBox = this.container.querySelector('#qaResultsContainer');
    const typePill = this.container.querySelector('#sourceTypePill');

    resBox.innerHTML = `
      <div class="qa-loading">
        <div class="loading-spinner"></div>
        <span>Searching indexed personal passages...</span>
      </div>
    `;

    try {
      const res = await api.queryKnowledgeDocuments(queryText.trim());

      if (typePill) {
        if (res.isDocumentSupported) {
          typePill.textContent = 'DOCUMENT-SUPPORTED';
          typePill.className = 'telemetry-badge supported';
        } else {
          typePill.textContent = 'GENERAL KNOWLEDGE';
          typePill.className = 'telemetry-badge general';
        }
      }

      let citationsHtml = '';
      if (res.citations && res.citations.length > 0) {
        citationsHtml = `
          <div class="citations-section">
            <span class="telemetry-label">GROUNDED SOURCE CITATIONS</span>
            <div class="citations-grid">
              ${res.citations
                .map(
                  (c) => `
                <div class="citation-card">
                  <div class="citation-head">
                    <span class="citation-filename">${c.filename}</span>
                    <span class="citation-page">p. ${c.page}</span>
                  </div>
                  <div class="citation-snippet">"${c.snippet}"</div>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        `;
      }

      resBox.innerHTML = `
        <div class="qa-response-card ${res.isDocumentSupported ? 'supported' : 'general'}">
          <div class="qa-badge-banner">
            <span class="qa-badge ${res.sourceType}">
              ${res.isDocumentSupported ? '✓ DOCUMENT-SUPPORTED' : '⚡ GENERAL-KNOWLEDGE'}
            </span>
            <span class="qa-query-echo">Query: "${res.query}"</span>
          </div>
          <div class="qa-answer-text">${res.answer.replace(/\n/g, '<br/>')}</div>
          ${citationsHtml}
        </div>
      `;
    } catch (err) {
      resBox.innerHTML = `<div class="qa-error">Query failed: ${err.message}</div>`;
    }
  }

  async _loadMemories(category = null) {
    try {
      this.memories = await api.getPersonalMemories(category);
      this._renderMemories();
    } catch (err) {
      console.warn('Failed to load memories:', err);
    }
  }

  _renderMemories() {
    const badge = this.container.querySelector('#memoryCountBadge');
    if (badge) badge.textContent = `${this.memories.length} item(s)`;

    const list = this.container.querySelector('#memoriesContainer');
    if (!list) return;

    if (this.memories.length === 0) {
      list.innerHTML = `<div class="doc-empty-state">No personal memories in this category.</div>`;
      return;
    }

    list.innerHTML = this.memories
      .map(
        (m) => `
        <div class="memory-card" data-id="${m.id}">
          <div class="mem-head">
            <span class="mem-cat-badge ${m.category}">${m.category.toUpperCase()}</span>
            <span class="mem-key">${m.keyName}</span>
            <button type="button" class="btn-mem-del" data-del-id="${m.id}" title="Forget memory">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="mem-value">${m.valueText}</div>
        </div>
      `
      )
      .join('');

    list.querySelectorAll('.btn-mem-del').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.delId;
        if (!confirm('Permanently delete this explicit memory?')) return;
        try {
          await api.deletePersonalMemory(id);
          toast.success('Memory deleted.');
          await this._loadMemories();
        } catch (err) {
          toast.error(`Delete failed: ${err.message}`);
        }
      });
    });
  }

  async _loadWorkflows() {
    try {
      this.workflows = await api.getWorkflows();
      this._renderWorkflows();
    } catch (err) {
      console.warn('Failed to load workflows:', err);
    }
  }

  _renderWorkflows() {
    const grid = this.container.querySelector('#workflowCardsGrid');
    if (!grid) return;

    grid.innerHTML = this.workflows
      .map(
        (w) => `
        <div class="workflow-card" data-id="${w.id}">
          <div class="wf-card-top">
            <span class="wf-step-badge">${w.stepCount || w.steps?.length || 0} Steps</span>
            <span class="wf-builtin-badge">${w.isBuiltin ? 'CORE TEMPLATE' : 'CUSTOM'}</span>
          </div>
          <div class="wf-card-title">${w.name}</div>
          <div class="wf-card-desc">${w.description}</div>
          <div class="wf-card-actions">
            <button type="button" class="btn-holo-sm btn-inspect-wf" data-wf-id="${w.id}">
              <span>Inspect Steps</span>
            </button>
            <button type="button" class="btn-holo-primary btn-run-wf" data-wf-id="${w.id}">
              <span>Run Workflow</span>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </button>
          </div>
        </div>
      `
      )
      .join('');

    // Inspect Steps
    grid.querySelectorAll('.btn-inspect-wf').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.wfId;
        try {
          const prop = await api.proposeWorkflow(id);
          const stepsSummary = prop.proposedSteps
            .map((s, i) => `${i + 1}. [${s.toolName}] ${s.name}`)
            .join('\n');
          alert(`Workflow: ${prop.name}\n\nProposed Steps:\n${stepsSummary}`);
        } catch (e) {
          toast.error(e.message);
        }
      });
    });

    // Run Workflow
    grid.querySelectorAll('.btn-run-wf').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.wfId;
        await this._executeWorkflow(id);
      });
    });
  }

  async _executeWorkflow(workflowId) {
    const banner = this.container.querySelector('#workflowActiveBanner');
    if (banner) {
      banner.classList.remove('hidden');
      banner.innerHTML = `
        <div class="wf-banner-inner">
          <div class="loading-spinner"></div>
          <span class="wf-banner-status">Initiating sequential execution for '${workflowId}'...</span>
        </div>
      `;
    }

    try {
      toast.info(`Executing workflow: ${workflowId}...`);
      const result = await api.runWorkflow(workflowId, {});
      this.activeWorkflowRun = result;
      this._renderActiveWorkflowStatus(result);

      if (result.status === 'succeeded') {
        toast.success(`Workflow '${result.workflowName}' succeeded! (${result.stepsCompleted}/${result.totalSteps} steps completed).`);
      } else if (result.status === 'failed') {
        toast.error(`Workflow stopped safely: Step ${result.failedAtStep + 1} failed (${result.error}).`);
      } else if (result.status === 'awaiting_confirmation') {
        toast.warn(`Workflow paused: Step ${result.pendingStep.stepIndex + 1} requires operator confirmation.`);
      }

      await this._loadTimeline();
    } catch (err) {
      toast.error(`Workflow failed to launch: ${err.message}`);
      if (banner) banner.classList.add('hidden');
    }
  }

  _renderActiveWorkflowStatus(run) {
    const banner = this.container.querySelector('#workflowActiveBanner');
    if (!banner || !run) return;

    banner.classList.remove('hidden');

    const stepsHtml = (run.steps || [])
      .map(
        (s, i) => `
        <div class="wf-step-node ${s.status}">
          <span class="wf-step-num">${i + 1}</span>
          <div class="wf-step-details">
            <span class="wf-step-title">${s.name}</span>
            <span class="wf-step-sub">${s.toolName} • ${s.status.toUpperCase()}</span>
          </div>
        </div>
      `
      )
      .join('');

    let actionButtonsHtml = '';
    if (run.status === 'awaiting_confirmation' && run.pendingStep) {
      actionButtonsHtml = `
        <div class="wf-confirm-bar">
          <span>⚠️ Step ${run.pendingStep.stepIndex + 1} (${run.pendingStep.name}) requires operator confirmation.</span>
          <button type="button" class="btn-holo-primary btn-resume-wf">
            <span>Confirm & Proceed</span>
          </button>
          <button type="button" class="btn-holo-sm btn-cancel-wf">
            <span>Abort Workflow</span>
          </button>
        </div>
      `;
    } else if (run.status === 'running') {
      actionButtonsHtml = `
        <button type="button" class="btn-holo-sm btn-cancel-wf">
          <span>Cancel Execution</span>
        </button>
      `;
    } else {
      actionButtonsHtml = `
        <button type="button" class="btn-holo-sm btn-close-wf-banner">
          <span>Dismiss</span>
        </button>
      `;
    }

    banner.innerHTML = `
      <div class="wf-banner-card ${run.status}">
        <div class="wf-banner-top">
          <span class="wf-name">${run.workflowName || run.workflowId}</span>
          <span class="wf-status-pill ${run.status}">${(run.status || 'running').toUpperCase()}</span>
        </div>
        <div class="wf-steps-track">${stepsHtml}</div>
        ${actionButtonsHtml}
      </div>
    `;

    // Bind banner buttons
    const btnResume = banner.querySelector('.btn-resume-wf');
    if (btnResume) {
      btnResume.addEventListener('click', async () => {
        try {
          const res = await api.resumeWorkflowRun(run.runId, {
            confirmationToken: run.pendingStep.confirmationToken,
            confirmed: true
          });
          this._renderActiveWorkflowStatus(res);
          await this._loadTimeline();
        } catch (e) {
          toast.error(e.message);
        }
      });
    }

    const btnCancel = banner.querySelector('.btn-cancel-wf');
    if (btnCancel) {
      btnCancel.addEventListener('click', async () => {
        try {
          const res = await api.cancelWorkflowRun(run.runId);
          toast.warn('Workflow execution cancelled.');
          this._renderActiveWorkflowStatus(res);
          await this._loadTimeline();
        } catch (e) {
          toast.error(e.message);
        }
      });
    }

    const btnClose = banner.querySelector('.btn-close-wf-banner');
    if (btnClose) {
      btnClose.addEventListener('click', () => banner.classList.add('hidden'));
    }
  }

  async _loadTimeline() {
    try {
      this.timeline = await api.getActivityTimeline(25);
      this._renderTimeline();
    } catch (err) {
      console.warn('Failed to load timeline:', err);
    }
  }

  _renderTimeline() {
    const badge = this.container.querySelector('#timelineCountBadge');
    if (badge) badge.textContent = `${this.timeline.length} event(s)`;

    const list = this.container.querySelector('#timelineScrollContainer');
    if (!list) return;

    if (this.timeline.length === 0) {
      list.innerHTML = `<div class="doc-empty-state">No activity events recorded yet.</div>`;
      return;
    }

    list.innerHTML = this.timeline
      .map(
        (e) => `
        <div class="timeline-item ${e.status}">
          <div class="timeline-left">
            <span class="timeline-dot ${e.status}"></span>
            <span class="timeline-time">${new Date(e.timestamp).toLocaleTimeString()}</span>
          </div>
          <div class="timeline-content">
            <div class="timeline-title-row">
              <span class="timeline-title">${e.title}</span>
              <span class="timeline-status-pill ${e.status}">${(e.status || 'succeeded').toUpperCase()}</span>
            </div>
            <div class="timeline-summary">${e.summary || ''}</div>
          </div>
          ${
            e.isCancellable
              ? `<button type="button" class="btn-timeline-cancel" data-id="${e.id}" title="Cancel operation">Cancel</button>`
              : ''
          }
        </div>
      `
      )
      .join('');
  }
}

