-- ==============================================================================
-- NOVA Backend — Database Migration: 002_stage2_tools_and_actions.sql
-- Stage 2: Notes, Reminders, and Structured Action Execution System
-- ==============================================================================

-- 1. Notes System
CREATE TABLE IF NOT EXISTS notes (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content MEDIUMTEXT NOT NULL,
  tags JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_notes_title (title),
  INDEX idx_notes_created (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Reminders System (with Overdue Reconciliation Support)
CREATE TABLE IF NOT EXISTS reminders (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  due_at DATETIME NOT NULL,
  priority VARCHAR(20) NOT NULL DEFAULT 'medium',
  status ENUM('pending', 'completed', 'cancelled', 'overdue') NOT NULL DEFAULT 'pending',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_reminders_status_due (status, due_at),
  INDEX idx_reminders_created (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Structured Actions & Tool Executions State Machine
CREATE TABLE IF NOT EXISTS actions (
  id VARCHAR(36) PRIMARY KEY,
  session_id VARCHAR(36) NULL,
  tool_name VARCHAR(64) NOT NULL,
  arguments_json JSON NOT NULL,
  status ENUM('proposed', 'awaiting_confirmation', 'running', 'succeeded', 'failed', 'cancelled') NOT NULL DEFAULT 'proposed',
  requires_confirmation BOOLEAN NOT NULL DEFAULT FALSE,
  confirmation_token VARCHAR(64) NULL,
  result_json JSON NULL,
  error_message TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_actions_session (session_id),
  INDEX idx_actions_status (status),
  INDEX idx_actions_created (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

