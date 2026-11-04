/**
 * NOVA Backend — Preferences Service
 * Persists and retrieves user preferences using JSON column in MySQL
 * with persistent JSON file fallback when MySQL is unreachable.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from '../database/connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const PREF_FILE = path.join(DATA_DIR, 'preferences.json');

const PREF_KEY = 'user_settings';

const DEFAULT_PREFERENCES = {
  themeAccent: 'cyan',
  reducedMotion: false,
  ttsEnabled: true,
  speechRate: 1.0,
  speechPitch: 1.0,
  voiceURI: 'default',
  quality: 'high'
};

function readFallbackPreferences() {
  try {
    if (fs.existsSync(PREF_FILE)) {
      const raw = fs.readFileSync(PREF_FILE, 'utf8');
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
    }
  } catch (e) {}
  return { ...DEFAULT_PREFERENCES };
}

function writeFallbackPreferences(settings) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(PREF_FILE, JSON.stringify(settings, null, 2), 'utf8');
  } catch (e) {}
}

export async function getPreferences() {
  try {
    const [rows] = await query(
      'SELECT settings_json, updated_at AS updatedAt FROM preferences WHERE id = ?',
      [PREF_KEY]
    );

    if (rows.length === 0) {
      return readFallbackPreferences();
    }

    const raw = rows[0].settings_json;
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch (err) {
    return readFallbackPreferences();
  }
}

export async function savePreferences(newSettings) {
  const current = await getPreferences();
  const merged = { ...current, ...newSettings };
  const jsonStr = JSON.stringify(merged);
  const now = new Date();

  writeFallbackPreferences(merged);

  try {
    await query(
      `INSERT INTO preferences (id, settings_json, updated_at) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE settings_json = ?, updated_at = ?`,
      [PREF_KEY, jsonStr, now, jsonStr, now]
    );
  } catch (err) {
    // MySQL unreachable; saved to fallback store
  }

  return merged;
}

