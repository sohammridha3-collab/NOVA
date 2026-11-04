/**
 * NOVA Local Automation Agent — Configuration
 * Stage 4: Local Windows Automation
 *
 * Security Principles:
 * - Binds strictly to 127.0.0.1 (local loopback)
 * - Authenticated pairing with NOVA Backend via secret token
 * - Explicit application whitelist (No arbitrary command execution)
 * - Strict workspace canonical folder boundaries
 * - Sensitive directory & credential store exclusion
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  host: process.env.AGENT_HOST || '127.0.0.1',
  port: parseInt(process.env.AGENT_PORT, 10) || 3002,
  pairingSecret: process.env.AGENT_PAIRING_SECRET || 'nova_agent_pairing_secret_99a8b7c6',
  actionTimeoutMs: parseInt(process.env.AGENT_ACTION_TIMEOUT_MS, 10) || 15000,

  // Dedicated workspace root
  workspaceRoot: process.env.NOVA_WORKSPACE_ROOT
    ? path.resolve(process.env.NOVA_WORKSPACE_ROOT)
    : path.resolve(__dirname, '../../workspace'),

  // Configured Application Mappings (Whitelist only)
  allowedApps: {
    notepad: {
      id: 'notepad',
      name: 'Windows Notepad',
      executable: 'notepad.exe',
      description: 'Default Windows text editor',
      acceptsFileArg: true
    },
    calc: {
      id: 'calc',
      name: 'Windows Calculator',
      executable: 'calc.exe',
      description: 'Windows Calculator utility',
      acceptsFileArg: false
    },
    explorer: {
      id: 'explorer',
      name: 'Windows Explorer',
      executable: 'explorer.exe',
      description: 'Windows File Explorer',
      acceptsFileArg: true
    },
    paint: {
      id: 'paint',
      name: 'Paint',
      executable: 'mspaint.exe',
      description: 'Windows Paint graphic editor',
      acceptsFileArg: true
    },
    edge: {
      id: 'edge',
      name: 'Microsoft Edge',
      executable: 'msedge.exe',
      description: 'Microsoft Edge web browser',
      acceptsFileArg: false
    }
  },

  // Sensitive patterns and credential stores strictly forbidden from access
  sensitivePatterns: [
    /\.ssh[/\\]?/i,
    /\.aws[/\\]?/i,
    /\.env/i,
    /\.git[/\\]?/i,
    /id_rsa/i,
    /id_ed25519/i,
    /credentials/i,
    /\.pem$/i,
    /\.key$/i,
    /password/i,
    /token/i,
    /secrets?/i
  ],

  // Stage 5: Android Device Connector Configuration
  android: {
    adbPath: process.env.ADB_PATH || 'adb',
    // Optional serial filter: if set, only devices with these serials will be permitted
    authorizedSerials: (process.env.NOVA_AUTHORIZED_ANDROID_SERIALS || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean),
    // Configured Android applications whitelist
    allowedApps: {
      youtube: { name: 'YouTube', package: 'com.google.android.youtube' },
      spotify: { name: 'Spotify', package: 'com.spotify.music' },
      chrome: { name: 'Google Chrome', package: 'com.android.chrome' },
      settings: { name: 'Settings', package: 'com.android.settings' },
      maps: { name: 'Google Maps', package: 'com.google.android.apps.maps' },
      camera: { name: 'Camera', package: 'com.android.camera2' }
    },
    // Media keycode mappings
    mediaKeycodes: {
      play_pause: 85,
      play: 126,
      pause: 127,
      next: 87,
      previous: 88,
      volume_up: 24,
      volume_down: 25,
      mute: 164,
      home: 3,
      back: 4
    }
  }
};

