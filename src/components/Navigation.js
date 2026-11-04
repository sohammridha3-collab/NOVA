/**
 * NOVA — Vertical Navigation Dock Component
 * Precision slim vertical dock with micro active indicator lines and view routing.
 */

import { ICONS } from '../utils/icons.js';

export class Navigation {
  constructor({
    sidebarElement,
    onViewChange,
    onOpenSettings,
    onNewChat,
    onActivityLogged
  }) {
    this.sidebar = sidebarElement;
    this.onViewChange = onViewChange || (() => {});
    this.onOpenSettings = onOpenSettings || (() => {});
    this.onNewChat = onNewChat || (() => {});
    this.onActivityLogged = onActivityLogged || (() => {});

    this.activeView = 'assistant'; // 'assistant' | 'studio' | 'history'

    this.init();
  }

  init() {
    this._renderLayout();
    this._bindEvents();
  }

  _renderLayout() {
    this.sidebar.innerHTML = `
      <!-- Top Navigation Dock Items -->
      <div class="sidebar-nav-group">
        <!-- Assistant Nav Item (Default active) -->
        <button
          type="button"
          class="nav-item active"
          data-view="assistant"
          title="Command Studio & Artifact"
          aria-label="Command Studio"
        >
          <span class="nav-icon">${ICONS.assistant}</span>
        </button>

        <!-- Website Studio Nav Item -->
        <button
          type="button"
          class="nav-item"
          data-view="studio"
          title="Autonomous Website Studio"
          aria-label="Website Studio"
        >
          <span class="nav-icon">${ICONS.studio}</span>
        </button>

        <!-- Conversation History Nav Item -->
        <button
          type="button"
          class="nav-item"
          data-view="history"
          title="Conversation Archive"
          aria-label="Conversation Archive"
        >
          <span class="nav-icon">${ICONS.history}</span>
        </button>

        <!-- Settings Nav Item -->
        <button
          type="button"
          class="nav-item"
          data-action="settings"
          title="System Preferences"
          aria-label="System Preferences"
        >
          <span class="nav-icon">${ICONS.settings}</span>
        </button>
      </div>

      <!-- Bottom Dock Actions -->
      <div class="sidebar-footer">
        <!-- New Chat Trigger Button -->
        <button
          type="button"
          class="nav-item"
          id="btnSidebarNewChat"
          title="Start fresh conversation"
          aria-label="New Conversation"
          style="background: rgba(0, 240, 255, 0.08); border-color: var(--border-subtle); color: var(--accent-cyan);"
        >
          <span class="nav-icon">${ICONS.plus}</span>
        </button>
      </div>
    `;
  }

  _bindEvents() {
    const navItems = this.sidebar.querySelectorAll('.nav-item');
    const newChatBtn = this.sidebar.querySelector('#btnSidebarNewChat');

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const view = item.getAttribute('data-view');
        const action = item.getAttribute('data-action');

        if (action === 'settings') {
          this.onOpenSettings();
          return;
        }

        if (view) {
          this.setActiveView(view);
        }
      });
    });

    if (newChatBtn) {
      newChatBtn.addEventListener('click', () => {
        this.setActiveView('assistant');
        this.onNewChat();
      });
    }
  }

  setActiveView(viewName) {
    if (this.activeView === viewName && viewName !== 'history') return;

    this.activeView = viewName;
    const navItems = this.sidebar.querySelectorAll('.nav-item[data-view]');
    navItems.forEach(item => {
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    this.onViewChange(viewName);
    this.onActivityLogged(`Navigated: ${viewName.toUpperCase()} View`);
  }
}
