/**
 * NOVA Local Automation Agent — Operating System Information Handler
 * Reports real, genuinely measured system telemetry from the Windows host.
 */

import os from 'os';

export function getOsInfo() {
  const cpus = os.cpus() || [];
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;

  return {
    platform: os.platform(),
    osType: os.type(),
    osRelease: os.release(),
    osVersion: os.version ? os.version() : 'Windows',
    architecture: os.arch(),
    hostname: os.hostname(),
    cpu: {
      model: cpus[0]?.model || 'Standard CPU',
      cores: cpus.length,
      speedMhz: cpus[0]?.speed || 0
    },
    memory: {
      totalBytes: totalMem,
      totalGb: parseFloat((totalMem / (1024 ** 3)).toFixed(2)),
      freeBytes: freeMem,
      freeGb: parseFloat((freeMem / (1024 ** 3)).toFixed(2)),
      usedBytes: usedMem,
      usedGb: parseFloat((usedMem / (1024 ** 3)).toFixed(2)),
      usedPercentage: Math.round((usedMem / totalMem) * 100)
    },
    uptimeSeconds: Math.round(os.uptime()),
    uptimeFormatted: formatUptime(os.uptime()),
    systemTime: new Date().toISOString()
  };
}

function formatUptime(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

