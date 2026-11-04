/**
 * NOVA Backend — Preferences Service
 * Persists and retrieves user preferences using JSON column in MySQL.
 */

import { query } from '../database/connection.js';

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

export async function getPreferences() {
  const [rows] = await query(
    'SELECT settings_json, updated_at AS updatedAt FROM preferences WHERE id = ?',
    [PREF_KEY]
  );

  if (rows.length === 0) {
    return DEFAULT_PREFERENCES;
  }

  const raw = rows[0].settings_json;
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
}

export async function savePreferences(newSettings) {
  const current = await getPreferences();
  const merged = { ...current, ...newSettings };
  const jsonStr = JSON.stringify(merged);
  const now = new Date();

  await query(
    `INSERT INTO preferences (id, settings_json, updated_at) 
     VALUES (?, ?, ?) 
     ON DUPLICATE KEY UPDATE settings_json = ?, updated_at = ?`,
    [PREF_KEY, jsonStr, now, jsonStr, now]
  );

  return merged;
}

