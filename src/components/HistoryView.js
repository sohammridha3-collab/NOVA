/**
 * NOVA — Conversation History Manager Component
 * Enables saving, reopening, searching, deleting, and clearing all local sessions.
 */

import { ICONS } from '../utils/icons.js';
import { storage } from '../services/storage.js';
import { toast } from './Toast.js';

export class HistoryView {
  constructor({ container, onSelectSession, onNewSession, onActivityLogged }) {
    this.container = container;
    this.onSelectSession = onSelectSession || (() => {});
    this.onNewSession = onNewSession || (() => {});
    this.onActivityLogged = onActivityLogged || (() => {});

    this.searchQuery = '';
    this.init();
  }

  init() {
    this._renderLayout();
    this._bindEvents();
    this.refresh();
  }

  _renderLayout() {
    this.container.innerHTML = `
      <div class="modal-dialog" style="max-width: 620px; width: 100%; margin: 1.5rem auto; height: calc(100% - 3rem);">
        <div class="modal-header">
          <div class="modal-title-wrap">
            ${ICONS.history}
            <span class="modal-title">Conversation Archive</span>
          </div>

          <button class="btn-primary" id="btnHistoryNewChat">
            ${ICONS.plus}
            <span>New Chat</span>
          </button>
        </div>

        <div class="modal-body">
          <!-- Search Bar -->
          <div class="history-search-bar">
            ${ICONS.search}
            <input
              type="text"
              class="history-search-input"
              id="historySearchInput"
              placeholder="Search past conversations..."
              aria-label="Search conversation history"
            />
          </div>

          <!-- History List Container -->
          <div class="history-list" id="historyListContainer">
            <!-- Dynamic items rendered here -->
          </div>
        </div>

        <div class="modal-footer" style="justify-content: space-between;">
          <span class="hud-hint" id="historyTotalCount">0 conversations saved locally</span>
          <button class="btn-danger" id="btnClearAllHistory">
            ${ICONS.trash}
            <span>Clear All History</span>
          </button>
        </div>
      </div>
    `;
  }

  _bindEvents() {
    const searchInput = this.container.querySelector('#historySearchInput');
    const newChatBtn = this.container.querySelector('#btnHistoryNewChat');
    const clearAllBtn = this.container.querySelector('#btnClearAllHistory');
    const listContainer = this.container.querySelector('#historyListContainer');

    // Search filter
    searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.renderList();
    });

    // New chat button
    newChatBtn.addEventListener('click', () => {
      this.onNewSession();
    });

    // Clear all history with confirmation
    clearAllBtn.addEventListener('click', () => {
      const confirmed = window.confirm('Are you sure you want to permanently clear all stored conversations? This cannot be undone.');
      if (confirmed) {
        storage.saveSessions([]);
        storage.setActiveSessionId(null);
        this.onNewSession();
        this.refresh();
        this.onActivityLogged('Cleared all conversation history');
        toast.warning('All conversation records deleted.');
      }
    });

    // List item click delegation (open session or delete session)
    listContainer.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('.btn-delete-session');
      if (deleteBtn) {
        e.stopPropagation();
        const sessionId = deleteBtn.getAttribute('data-session-id');
        if (sessionId) {
          storage.deleteSession(sessionId);
          this.refresh();
          this.onActivityLogged(`Deleted conversation: ${sessionId}`);
          toast.info('Conversation removed.');
        }
        return;
      }

      const item = e.target.closest('.history-item');
      if (item) {
        const sessionId = item.getAttribute('data-session-id');
        if (sessionId) {
          this.onSelectSession(sessionId);
        }
      }
    });
  }

  refresh() {
    this.renderList();
  }

  renderList() {
    const listContainer = this.container.querySelector('#historyListContainer');
    const countLabel = this.container.querySelector('#historyTotalCount');
    if (!listContainer) return;

    let sessions = storage.getSessions();
    const activeId = storage.getActiveSessionId();

    if (countLabel) {
      countLabel.textContent = `${sessions.length} conversation${sessions.length === 1 ? '' : 's'} stored in browser`;
    }

    if (this.searchQuery) {
      sessions = sessions.filter(s => {
        const titleMatch = s.title && s.title.toLowerCase().includes(this.searchQuery);
        const msgMatch = s.messages && s.messages.some(m => m.content && m.content.toLowerCase().includes(this.searchQuery));
        return titleMatch || msgMatch;
      });
    }

    if (sessions.length === 0) {
      listContainer.innerHTML = `
        <div class="history-empty-text">
          <p>No conversations found.</p>
          <span style="font-size: 0.75rem; color: var(--text-dim); margin-top: 0.4rem; display: block;">
            Start asking NOVA questions to build your archive.
          </span>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = '';
    sessions.forEach(s => {
      const dateStr = new Date(s.updatedAt || s.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      const msgCount = (s.messages || []).length;
      const isActive = s.id === activeId;

      const item = document.createElement('div');
      item.className = `history-item ${isActive ? 'active' : ''}`;
      item.setAttribute('data-session-id', s.id);
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');

      item.innerHTML = `
        <div class="history-item-meta">
          <span class="history-item-title">${this._escapeHtml(s.title || 'Untitled Session')}</span>
          <span class="history-item-sub">${dateStr} &bull; ${msgCount} message${msgCount === 1 ? '' : 's'}${isActive ? ' &bull; [ACTIVE]' : ''}</span>
        </div>

        <div class="history-item-actions">
          <button
            class="icon-btn btn-delete-session"
            data-session-id="${s.id}"
            title="Delete this conversation"
            aria-label="Delete conversation"
            style="width: 28px; height: 28px; color: var(--text-dim);"
          >
            ${ICONS.trash}
          </button>
        </div>
      `;

      listContainer.appendChild(item);
    });
  }

  _escapeHtml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

