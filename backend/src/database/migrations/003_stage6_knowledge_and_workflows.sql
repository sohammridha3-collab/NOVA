-- ==============================================================================
-- NOVA Backend — Database Migration: 003_stage6_knowledge_and_workflows.sql
-- Stage 6: Personal Knowledge, Document Indexing, Memories & Reusable Workflows
-- ==============================================================================

-- 1. Document Knowledge Store
CREATE TABLE IF NOT EXISTS documents (
  id VARCHAR(36) PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(20) NOT NULL,
  file_size INT NOT NULL,
  page_count INT NOT NULL DEFAULT 1,
  chunk_count INT NOT NULL DEFAULT 0,
  storage_path VARCHAR(500) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_documents_created (created_at DESC),
  INDEX idx_documents_type (file_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Document Chunks & Text Passages (for Replaceable Retrieval Layer)
CREATE TABLE IF NOT EXISTS document_chunks (
  id VARCHAR(36) PRIMARY KEY,
  document_id VARCHAR(36) NOT NULL,
  chunk_index INT NOT NULL,
  page_number INT NULL,
  section_title VARCHAR(255) NULL,
  content MEDIUMTEXT NOT NULL,
  token_count INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  INDEX idx_chunks_document (document_id, chunk_index)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Explicit User Memories & Knowledge Facts
CREATE TABLE IF NOT EXISTS memories (
  id VARCHAR(36) PRIMARY KEY,
  category VARCHAR(64) NOT NULL DEFAULT 'general',
  key_name VARCHAR(128) NOT NULL,
  value_text TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_memories_cat (category),
  INDEX idx_memories_key (key_name),
  INDEX idx_memories_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Reusable Workflow Definitions
CREATE TABLE IF NOT EXISTS workflows (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  description TEXT NULL,
  steps_json JSON NOT NULL,
  is_builtin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_workflows_builtin (is_builtin)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Workflow Execution Runs & Activity State
CREATE TABLE IF NOT EXISTS workflow_runs (
  id VARCHAR(36) PRIMARY KEY,
  workflow_id VARCHAR(64) NOT NULL,
  workflow_name VARCHAR(128) NOT NULL,
  status ENUM('proposed', 'running', 'succeeded', 'failed', 'cancelled', 'awaiting_confirmation') NOT NULL DEFAULT 'proposed',
  current_step_index INT NOT NULL DEFAULT 0,
  total_steps INT NOT NULL DEFAULT 0,
  steps_result_json JSON NULL,
  error_message TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME NULL,
  INDEX idx_runs_workflow (workflow_id),
  INDEX idx_runs_status (status),
  INDEX idx_runs_created (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

