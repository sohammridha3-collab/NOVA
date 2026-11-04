# NOVA Device Connectors — Android ADB & Home Assistant Architecture

The **NOVA Device Connectors** extend NOVA's intelligence into physical and smart-home environments through two strictly decoupled, audited integrations:
1. **Android ADB Bridge** via the Local Automation Agent for direct, capability-checked smartphone control.
2. **Home Assistant Connector** via the NOVA Backend for unified, capability-validated smart TV and IoT home management.

---

## 1. Architectural Overview

```
                                  +------------------------------------+
                                  |     NOVA Frontend UI (Vite)        |
                                  |  Holographic Devices Command View  |
                                  +-----------------+------------------+
                                                    |  HTTP / REST
                                                    v
                                  +-----------------+------------------+
                                  |     NOVA Node.js Backend API       |
                                  |          (Port 3001)               |
                                  |   AI Model & Tool Registry         |
                                  +--------+------------------+--------+
                                           |                  |
                         Authenticated     |                  |  REST API / Bearer Token
                         Loopback Pairing  |                  |  (HASS_BASE_URL & HASS_TOKEN)
                                           v                  v
       +-----------------------------------+---+          +---+--------------------------------+
       |   NOVA Local Automation Agent (Host)  |          |     Home Assistant Instance        |
       |         http://127.0.0.1:3002         |          |    (Local Network / IoT Hub)       |
       +-----------------+---------------------+          +---+----------------------------+---+
                         |                                    |                            |
                         | child_process.spawn()              v                            v
                         | (shell: false, Whitelisted Serial) +--------------+     +---------------+
                         v                                    | Smart TVs    |     | Smart Lights  |
       +-----------------+---------------------+              | Media Players|     | Plugs/Switches|
       |     Android Debug Bridge (ADB)        |              +--------------+     +---------------+
       +-----------------+---------------------+
                         | USB / WiFi ADB
                         v
       +-----------------+---------------------+
       | Authorized Android Handset / Emulator |
       +---------------------------------------+
```

---

## 2. Android ADB Integration (Local Automation Agent)

### A. State Machine & Device Authorization
Every connected handset reported by `adb devices -l` is classified into one of three strict states:
- **`authorized`**: Handset has accepted the RSA host cryptographic key and is ready for commands.
- **`unauthorized`**: Handset is connected, but the operator has not yet accepted the "Allow USB Debugging?" prompt on the phone screen. All actions are blocked.
- **`offline`**: Device is disconnected or transitioning. All actions are blocked.

Serial numbers are validated against strict regex (`/^[a-zA-Z0-9.:_-]+$/`). In addition, an optional `AUTHORIZED_ANDROID_SERIALS` whitelist enforces that only pre-approved handsets can be controlled.

### B. Security & Privacy Policies
> [!CAUTION]
> **Zero Lock-Screen PIN Bypass Policy**
> Under no circumstances does NOVA store, request, cache, or enter device lock-screen PINs, passwords, or swipe patterns. NOVA will **never** attempt to bypass handset authentication, biometric prompts, or Mobile Device Management (MDM) security policies. If a device is locked, actions requiring an unlocked screen fail safely or remain pending on the phone's native lock screen.

> [!IMPORTANT]
> **Explicit Consent for Screen Captures**
> Screenshots may contain sensitive personal data (e.g., chats, banking details, private photos). Therefore, `androidTakeScreenshot` is registered with `requiresConfirmation: true`. It executes **only** when the user explicitly provides `confirmed: true`. Screen captures are saved to temporary files and cleaned up immediately after transmission.

### C. Whitelisted Android Actions
All ADB commands are executed via `child_process.spawn()` with `shell: false` and structured arguments:
- **App Launching**: Only configured package components are allowed:
  - `youtube`: `com.google.android.youtube/com.google.android.youtube.HomeActivity`
  - `spotify`: `com.spotify.music/com.spotify.music.MainActivity`
  - `chrome`: `com.android.chrome/com.google.android.apps.chrome.Main`
  - `settings`: `com.android.settings/.Settings`
  - `maps`: `com.google.android.apps.maps/com.google.android.maps.MapsActivity`
  - `camera`: `android.media.action.STILL_IMAGE_CAMERA`
- **URL Navigation**: Validated against `http:` and `https:` protocols only. Launched via `android.intent.action.VIEW`.
- **Media Keys**: Safe Android keycodes dispatched via `input keyevent`:
  - `play_pause` (85), `vol+` (24), `vol-` (25), `mute` (164), `home` (3).

---

## 3. Home Assistant Integration (Backend Connector)

### A. Dynamic Discovery & Genuine Entity State
NOVA connects directly to Home Assistant using configured credentials (`HASS_BASE_URL` and `HASS_TOKEN`):
- Discovers entities under `media_player`, `light`, and `switch` domains.
- Queries genuine state (`on`, `off`, `playing`, `paused`, `idle`, `unavailable`).
- **Never invents successful responses**: If an entity is `unavailable`, the system honestly flags `isAvailable: false` and refuses operation execution with `DEVICE_UNAVAILABLE`.

### B. Capability Bitmask Enforcement (`supported_features`)
Smart TVs and media players vary widely in manufacturer capabilities. NOVA parses Home Assistant's `supported_features` bitmask (`MediaPlayerFeatures`) before executing any action:
- `PAUSE` = 1
- `SEEK` = 2
- `VOLUME_SET` = 4
- `VOLUME_MUTE` = 8
- `PREVIOUS_TRACK` = 16
- `NEXT_TRACK` = 32
- `TURN_ON` = 128
- `TURN_OFF` = 256
- `PLAY_MEDIA` = 512
- `VOLUME_STEP` = 1024
- `PLAY` = 16384

> [!WARNING]
> **No Assumed Operations**
> Many TVs (e.g. Roku TV or legacy IR/CEC bridges) support step-wise volume control (`volume_up` / `volume_down`) but **do not support** absolute volume setting (`set_volume_level`). If a user requests a direct volume percentage on a TV lacking `VOLUME_SET`, NOVA rejects the command with `CAPABILITY_NOT_SUPPORTED` rather than failing silently or pretending success.

### C. Ambiguity Resolution (`AMBIGUOUS_DEVICE_TARGET`)
When a user issues a command such as *"Turn on the TV"* and multiple matching entities are discovered (e.g., `Living Room TV` and `Bedroom TV`), NOVA halts execution, flags `isAmbiguous: true`, and presents candidate devices for explicit selection.

---

## 4. Registered Device Tools Specification

| Tool | Parameters | Consent / Gate | Description |
|---|---|---|---|
| `androidListDevices` | `{}` | None | Discovers USB & Wi-Fi Android devices and parses authorization states. |
| `androidLaunchApp` | `{ appId, serial? }` | App Whitelist | Launches a whitelisted application component via ADB. |
| `androidOpenUrl` | `{ url, serial? }` | HTTP/HTTPS Scheme | Opens an audited web address in the device's default browser. |
| `androidSendMediaKey` | `{ key, serial? }` | Key Whitelist | Sends standard media keycodes (`play_pause`, `vol+`, `vol-`, etc.). |
| `androidTakeScreenshot` | `{ serial?, confirmed }` | `requiresConfirmation: true` | Captures screen to temporary file with explicit operator consent. |
| `hassListEntities` | `{ domain? }` | None | Returns supported Home Assistant entities with availability flags. |
| `hassGetEntityState` | `{ entityId }` | None | Retrieves live telemetry, state, and capability bitmasks for an entity. |
| `hassControlMedia` | `{ entityId, action, value? }` | Capability Check | Controls power, volume, or playback after verifying device capabilities. |
| `hassControlSwitchOrLight` | `{ entityId, action, brightness? }` | None | Toggles switches or adjusts smart light brightness and power. |

---

## 5. Testing & Simulated Fixtures Notice

Automated test suites (`npm run test:all`, `agent/tests/android.test.js`, `backend/tests/devices.test.js`) are designed to run deterministically in CI/offline environments without physical Android phones or live Home Assistant instances:

> [!NOTE]
> **Simulated Fixtures Policy**
> When `MOCK_ADB=true` or when no Home Assistant token is configured, test runners and development fallbacks return fixtures clearly labelled with `[SIMULATED FIXTURE]`. These mock fixtures faithfully emulate all boundary conditions (unauthorized RSA dialogs, bitmask capability limits, unavailable states, and ambiguity).

### Physical-Device Checks Still Required
To deploy in production with real physical devices, the following manual checks must be performed:
1. **Physical Android Handset**:
   - Enable Developer Options (tap *Build Number* 7 times in Settings).
   - Enable **USB Debugging** (and optionally *Wireless Debugging*).
   - Connect via USB or pair via `adb pair <ip>:<port>`.
   - Accept the RSA fingerprint dialog on the phone screen (*Always allow from this computer*).
   - Run `adb devices` in terminal to confirm status is `device` (not `unauthorized`).
2. **Home Assistant Instance**:
   - Ensure Home Assistant is running on the local network (e.g., `http://homeassistant.local:8123`).
   - Navigate to *Profile > Security > Long-Lived Access Tokens* and generate a token.
   - Configure `backend/.env`:
     ```env
     HASS_BASE_URL=http://homeassistant.local:8123
     HASS_TOKEN=eyJhbGciOi...
     ```
   - Verify network accessibility and test device toggling from the NOVA Devices view.

