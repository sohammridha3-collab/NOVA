/**
 * NOVA Backend — Environment Configuration
 * Validates and exposes server, database, auth, and AI model settings with sensible defaults.
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3001,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'nova_db',
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10
  },
  auth: {
    ownerUsername: process.env.OWNER_USERNAME || 'nova_owner',
    ownerPassword: process.env.OWNER_PASSWORD || 'nova_local_2026',
    ownerApiKey: process.env.OWNER_API_KEY || 'nova_dev_api_key_8f1c4e92',
    jwtSecret: process.env.JWT_SECRET || 'nova_default_secret_key_change_me'
  },
  ai: {
    provider: process.env.AI_PROVIDER || 'gemini',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    modelName: process.env.MODEL_NAME || 'gemini-1.5-flash',
    timeoutMs: parseInt(process.env.MODEL_TIMEOUT_MS, 10) || 25000,
    maxContextMessages: parseInt(process.env.MAX_CONTEXT_MESSAGES, 10) || 12,
    maxRequestsPerMinute: parseInt(process.env.USAGE_LIMIT_MAX_REQUESTS_PER_MINUTE, 10) || 30
  },
  automation: {
    agentUrl: process.env.AUTOMATION_AGENT_URL || 'http://127.0.0.1:3002',
    pairingSecret: process.env.AUTOMATION_AGENT_SECRET || 'nova_agent_pairing_secret_99a8b7c6',
    timeoutMs: parseInt(process.env.AUTOMATION_TIMEOUT_MS, 10) || 15000
  },
  hass: {
    baseUrl: process.env.HASS_BASE_URL || '',
    token: process.env.HASS_TOKEN || '',
    timeoutMs: parseInt(process.env.HASS_TIMEOUT_MS, 10) || 10000
  }
};
