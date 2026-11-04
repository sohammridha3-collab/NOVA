/**
 * NOVA — Toast Notifications Manager
 * Displays clean, accessible alerts for system actions and warnings.
 */

import { ICONS } from '../utils/icons.js';

export class ToastManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    this.container.setAttribute('aria-live', 'polite');
    document.body.appendChild(this.container);
  }

  show(message, type = 'info', duration = 3800) {
    if (!this.container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');

    let iconSvg = ICONS.info;
    if (type === 'success') iconSvg = ICONS.check;
    if (type === 'error') iconSvg = ICONS.close;
    if (type === 'warning') iconSvg = ICONS.info;

    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${iconSvg}</span>
        <span class="toast-message">${message}</span>
      </div>
      <button class="toast-close-btn" aria-label="Close notification">
        ${ICONS.close}
      </button>
    `;

    const closeBtn = toast.querySelector('.toast-close-btn');
    const dismiss = () => {
      toast.classList.add('toast-fade-out');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 250);
    };

    closeBtn.addEventListener('click', dismiss);

    this.container.appendChild(toast);

    if (duration > 0) {
      setTimeout(dismiss, duration);
    }
  }

  success(msg) { this.show(msg, 'success'); }
  error(msg) { this.show(msg, 'error', 5000); }
  warning(msg) { this.show(msg, 'warning', 4500); }
  info(msg) { this.show(msg, 'info'); }
}

export const toast = new ToastManager();

