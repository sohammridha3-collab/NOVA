/**
 * NOVA — Simulated Knowledge Base & Intelligent Generator
 * Provides realistic, technical, formatted responses simulating a sci-fi AI assistant.
 */

export const MOCK_RESPONSES = [
  {
    triggers: ['restaurant', 'dining', 'food', 'michelin', 'menu', 'aura'],
    response: `### Neural Formulation: Celestial Gastronomy Architecture

For a high-end luxury dining establishment such as **AURA**, the brand identity should bridge terrestrial culinary technique with hyper-modern aesthetic restraint.

#### Core Structural Pillars:
1. **Atmospheric Hierarchy:** Deep charcoal/obsidian surfaces, champagne gold accents, and subtle volumetric lighting.
2. **Interactive Sequences:** A dynamic multi-course timeline rather than a static list of dishes.
3. **Frictionless Reservation Flow:** Sandboxed real-time seating availability with private alcove allocation.

Here is an architectural component pattern in TypeScript/Node for the reservation scheduling service:

\`\`\`typescript
interface TableReservation {
  id: string;
  guestCount: number;
  experienceType: 'SALON_14_COURSE' | 'CHEF_COUNTER_PAIRING';
  reservationTimestamp: string;
  specialDietaryFlags: string[];
}

export async function allocateDiningSlot(request: TableReservation): Promise<{ confirmed: boolean; slotId: string }> {
  // Verify seat availability across salon zones
  const isAvailable = await checkInventory(request.reservationTimestamp, request.guestCount);
  if (!isAvailable) {
    throw new Error("Zone capacity exceeded for specified window.");
  }
  return {
    confirmed: true,
    slotId: \`AURA-\${Date.now()}-\${request.guestCount}G\`
  };
}
\`\`\`

You can view the interactive working showcase in the **Website Studio** tab.`
  },
  {
    triggers: ['quantum', 'entanglement', 'physics', 'cryptography', 'qkd'],
    response: `### Quantum State Telemetry: Entanglement & QKD Protocol

Quantum Key Distribution (QKD) leverages the principles of quantum mechanics—specifically the **BB84 protocol** or **E91 entanglement protocol**—to guarantee unconditional secrecy based on Heisenberg's uncertainty principle.

#### Mathematical Foundation:
The bipartite entangled Bell state \( |\\Phi^+\\rangle \) is formulated as:
\`\`\`text
|Φ⁺⟩ = (1 / √2) * (|00⟩ + |11⟩)
\`\`\`

Any eavesdropping attempt (Eve) measures the state, causing wavefunction collapse:
- If Alice and Bob measure in matching rectilinear or diagonal bases, their bits are strictly correlated.
- If Eve intercepts, the Quantum Bit Error Rate (QBER) spikes above the threshold of **11%**, aborting key distribution.

Here is a Python simulation of the photon polarization basis matching:

\`\`\`python
import random

def simulate_bb84_exchange(qubits_count=16):
    alice_bits = [random.randint(0, 1) for _ in range(qubits_count)]
    alice_bases = [random.choice(['+', 'X']) for _ in range(qubits_count)]
    bob_bases = [random.choice(['+', 'X']) for _ in range(qubits_count)]
    
    # Sifted key generation
    shared_key = [
        alice_bits[i] 
        for i in range(qubits_count) 
        if alice_bases[i] == bob_bases[i]
    ]
    
    return {
        "raw_qubits": qubits_count,
        "matching_bases": len(shared_key),
        "sifted_key": "".join(map(str, shared_key))
    }

print(simulate_bb84_exchange())
\`\`\`

System status: Quantum entropy generator running at 99.98% fidelity.`
  },
  {
    triggers: ['react', 'hydration', 'debug', 'next', 'ssr'],
    response: `### Diagnostic Trace: React Hydration Mismatch Resolution

A hydration mismatch occurs when the server-rendered HTML markup differs from the initial client render tree before React attaches event listeners.

#### Common Root Causes:
1. **Client-only APIs during SSR:** Using \`window\`, \`localStorage\`, or \`navigator\` in initial component render phase.
2. **Non-deterministic values:** Calling \`Date.now()\`, \`Math.random()\`, or unsynchronized timestamps.
3. **Invalid HTML nesting:** e.g., \`<p>\` containing a \`<div>\`, or \`<table>\` without \`<tbody>\`.

#### Recommended Mitigation Pattern:

\`\`\`jsx
  import { useEffect, useState } from 'react';

  export function ClientOnlyMetric({ value }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      // Only executed on client after hydration completes
      setMounted(true);
    }, []);

    if (!mounted) {
      return <span className="skeleton-placeholder" aria-hidden="true" />;
    }

    return <span className="telemetry-value">{value}</span>;
  }
\`\`\`

*Diagnostic tip:* Run your build with \`NODE_ENV=development\` to view detailed diff trees in the browser DevTools console.`
  },
  {
    triggers: ['architecture', 'microservice', 'system', 'scale', 'backend'],
    response: `### Neural System Blueprint: Resilient Event-Driven Mesh

To construct a high-throughput backend supporting real-time neural streaming and autonomous agents:

#### Architecture Topology:
- **Edge Gateway:** Envoy or Cloudflare Workers performing TLS termination and mTLS routing.
- **WebSocket / SSE Ingress:** Node.js Fastify instance managing persistent bidirectional streams.
- **Message Bus:** Apache Kafka or Redis Streams for decoupling chat ingestion from LLM inference.
- **Worker Pools:** Asynchronous Python / Go microservices processing embeddings and vector searches.

\`\`\`text
[ Client Client ] <--- SSE / WSS ---> [ API Gateway / Fastify ]
                                              |
                                      (Event Dispatch)
                                              v
                                      [ Redis Stream ]
                                              |
                    +-------------------------+-------------------------+
                    v                                                   v
           [ Agent Executor ]                                  [ Telemetry Logger ]
                    |                                                   |
                    v                                                   v
         [ Inference Engine / Vector DB ]                         [ TimeSeries DB ]
\`\`\`

All message buffers in NOVA are structured to facilitate drop-in connection to this exact Express/Fastify topology.`
  }
];

export function getSimulatedResponse(prompt) {
  const lower = prompt.toLowerCase();
  
  for (const item of MOCK_RESPONSES) {
    if (item.triggers.some(t => lower.includes(t))) {
      return item.response;
    }
  }

  // Dynamic procedural response for general questions
  return `### Neural Synthesis: Query Processing Complete

Analyzing query parameters: **"${prompt.slice(0, 60)}${prompt.length > 60 ? '...' : ''}"**

NOVA Core has verified local telemetry. In this frontend demonstration environment, all neural cognitive routines operate inside the browser's execution context.

#### Key Inferences:
- **Context Depth:** Multi-turn session states are preserved in local storage.
- **3D Neural Core:** Shader displacement and harmonic frequency reflect acoustic and cognitive states.
- **Extensibility:** The API adapter layer is modularized for rapid integration with an active Node.js/Express server.

Here is an example client integration snippet for connecting to a live backend endpoint:

\`\`\`javascript
// Seamless transition to Node.js/Express:
async function queryLiveBackend(userPrompt) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userPrompt })
  });
  const data = await response.json();
  return data.reply;
}
\`\`\`

Ready for next sequence. Ask a technical question, test voice commands, or explore the **Website Studio** preview.`;
}

