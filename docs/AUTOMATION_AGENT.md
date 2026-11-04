# NOVA Local Automation Agent — Windows Architecture & Security Specification

The **NOVA Local Automation Agent** is a secure, decoupled local service that bridges the NOVA AI Assistant and your Windows host. It enables controlled, audited local desktop tasks while strictly isolating the operating system from arbitrary execution.

---

## 1. Architectural Overview

```
                                  +------------------------------------+
                                  |     NOVA Frontend UI (Vite)        |
                                  |   Holographic Command Centre       |
                                  +-----------------+------------------+
                                                    |  HTTP / REST
                                                    v
                                  +-----------------+------------------+
                                  |     NOVA Node.js Backend API       |
                                  |          (Port 3001)               |
                                  |  AI Model / Tool Registry Engine   |
                                  +-----------------+------------------+
                                                    |  Authenticated Pairing
                                                    |  (Bearer Token over Loopback)
                                                    v
+---------------------------------------------------+---------------------------------------------------+
|                           NOVA LOCAL AUTOMATION AGENT (Windows Host)                                 |
|                                       http://127.0.0.1:3002                                           |
|                                                                                                       |
|  +------------------------+   +------------------------+   +---------------------------------------+  |
|  | Application Launcher   |   | Workspace Manager      |   | Host Telemetry Engine                 |  |
|  | Strict Whitelist       |   | Canonical Containment  |   | Genuine Windows Measurements          |  |
|  | (notepad, calc, etc.)  |   | Traversal & Link Defense|  | (CPU, Memory, Uptime)                 |  |
|  +------------------------+   +------------------------+   +---------------------------------------+  |
+---------------------------------------------------+---------------------------------------------------+
                                                    |
                                                    v
                                  +-----------------+------------------+
                                  |      Dedicated Workspace           |
                                  |     (./workspace/notes/)           |
                                  +------------------------------------+
```

---

## 2. Core Security Principles & Defenses

### A. Zero Shell Execution (`shell: false`)
- The agent **never** passes natural-language, model-generated prompts, or dynamic commands to a command shell (`cmd.exe`, `powershell.exe`, `bash`, `sh`).
- Every executable invocation uses Node.js `child_process.spawn()` with `shell: false` and explicitly typed, isolated arguments.
- Keywords such as `powershell`, `cmd`, `exec`, `eval`, and `terminal` are rejected unconditionally with `SHELL_EXECUTION_FORBIDDEN`.

### B. Application Whitelist Mapping
Only explicitly configured, pre-approved applications can be invoked:
| App ID | Windows Target | Structured Args | File Association |
|---|---|---|---|
| `notepad` | `notepad.exe` | Optional file path | Yes (Workspace files only) |
| `calc` | `calc.exe` | None | No |
| `explorer` | `explorer.exe` | Optional folder/file path | Yes (Workspace paths only) |
| `paint` | `mspaint.exe` | Optional image/file path | Yes (Workspace paths only) |
| `edge` | `msedge.exe` | None | No |

*Any unmapped application request is blocked with HTTP 403 `APP_NOT_PERMITTED`.*

### C. Canonical Workspace Containment & Symlink Defense
- All file operations are restricted to the dedicated `workspace/` root.
- Path resolution uses `path.resolve()` and `path.relative()` to verify containment.
- For existing paths, `fs.realpathSync()` resolves underlying filesystem symlinks to prevent directory traversal attacks (e.g. `../../Windows/System32`).
- Traversals are blocked with HTTP 403 `PATH_TRAVERSAL_DETECTED`.

### D. Sensitive Credential Store Protection
Access to sensitive stores and files is blocked automatically:
- `.ssh`, `.aws`, `.env`, `credentials`, `id_rsa`, `id_ed25519`, `config`, `.git`
- Blocked with HTTP 403 `SENSITIVE_STORE_PROTECTED`.

### E. Strict URL Protocol Validation
- Only `http:` and `https:` schemes are permitted.
- `file://`, `javascript:`, `data:`, `vbscript:`, or arbitrary executable paths are rejected with HTTP 403 `UNAUTHORIZED_PROTOCOL`.
- Safe launching via Windows `rundll32 url.dll,FileProtocolHandler`.

### F. Destructive Confirmation Policy
- Overwriting existing workspace notes (`createWorkspaceNote`) requires explicit parameter `confirmed: true`. Without it, HTTP 409 `CONFIRMATION_REQUIRED` is returned.
- Deleting files (`deleteWorkspaceFile`) requires operator confirmation bound to a cryptographic HMAC token.
- Tokens are bound to the exact action ID, tool name, and serialized arguments. Parameter tampering invalidates confirmation immediately.

### G. Cancellation & OS Permanence Notice
Operating-system side effects (e.g., spawning a process, writing a file) are real and cannot be reversed by software cancellation after completion. Action cards and status endpoints include the clear notice:
> *"Cancellation may not undo completed operating-system actions."*

---

## 3. Registered Automation Tools

| Tool | Parameters | Confirmation Required | Description |
|---|---|---|---|
| `getOperatingSystemInfo` | `{}` | No | Returns genuine Windows CPU specifications, memory utilization, and uptime. |
| `openConfiguredApp` | `{ appName, filePath? }` | No | Launches a whitelist app with structured arguments. |
| `searchWorkspaceFiles` | `{ query, subfolder? }` | No | Recursively searches workspace. Flags ambiguity (`isAmbiguous: true`) and returns candidates when multiple files match. |
| `openWorkspaceFile` | `{ filePath }` | No | Opens verified workspace file in system default application. |
| `createWorkspaceNote` | `{ filename, content, overwrite?, confirmed? }` | Yes (if file exists) | Creates note in `workspace/notes/`. Requires confirmation if overwriting. |
| `deleteWorkspaceFile` | `{ filePath, confirmed }` | Yes | Permanently removes file in workspace. Cryptographically verified confirmation required. |
| `openWebUrl` | `{ url }` | No | Validates and opens HTTP/HTTPS URL in default browser. |

---

## 4. Endpoints & API Contract

### Agent Server (`http://127.0.0.1:3002`)
- `GET /status` — Authenticated status check (requires `Authorization: Bearer <pairingSecret>` or `X-Agent-Secret`).
- `GET /capabilities` — Returns supported tools, whitelist applications, and workspace root.
- `POST /execute` — Executes an authorized automation action:
  ```json
  {
    "action": "createWorkspaceNote",
    "params": {
      "filename": "meeting-notes.md",
      "content": "Agenda: NOVA Stage 4 Architecture."
    }
  }
  ```

### Backend Bridge (`http://localhost:3001`)
- `GET /api/automation/status` — Reports live agent availability, platform, and host.
- `GET /api/automation/capabilities` — Reports supported capabilities and app whitelist.
- `POST /api/automation/execute` — Direct owner-authenticated action execution.

---

## 5. Running and Testing

### Start the Agent Standalone
```bash
npm run agent:start
```

### Run Agent Standalone Tests (12 Test Cases)
```bash
npm run agent:test
```

### Run Backend Integration Tests (Including Stage 4 Automation Suite)
```bash
npm run test:automation --prefix backend
```

### Run Entire Verified System Suite (58 Tests)
```bash
npm run test:all
```

