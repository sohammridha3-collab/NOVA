/**
 * NOVA Backend — Server Entry Point
 * Starts HTTP server on configured port and performs startup diagnostics.
 */

import { createApp } from './app.js';
import { config } from './config/env.js';
import { testConnection, closePool } from './database/connection.js';
import { ReminderService } from './services/reminderService.js';
import { modelAdapter } from './ai/modelAdapter.js';

const app = createApp();

const server = app.listen(config.port, process.env.HOST || '127.0.0.1', async () => {
  console.log('========================================================');
  console.log(`🌌 NOVA Backend API Server v2.0.0 Online`);
  console.log(`📡 URL: http://localhost:${config.port}`);
  console.log(`🔒 Single-Owner Auth: Active`);
  console.log(`🌐 Allowed CORS Origin: ${config.corsOrigin}`);
  console.log('--------------------------------------------------------');

  // Perform startup database readiness check
  const dbStatus = await testConnection();
  if (dbStatus.ok) {
    console.log(`✅ MySQL Database: Connected (${dbStatus.host}:${dbStatus.port}/${dbStatus.database})`);
    console.log(`🚀 Ready to accept API requests.`);
  } else {
    console.warn(`⚠️ MySQL Database: Disconnected (${dbStatus.code || 'DB_OFFLINE'})`);
    console.warn(`ℹ️ Setup Notice: ${dbStatus.setupGuide}`);
    console.warn(`ℹ️ Note: Server is running. Endpoints requiring database will return 503 until MySQL is configured.`);
  }

  // Model provider diagnostic
  const aiStatus = modelAdapter.getStatus();
  console.log(`🤖 AI Provider: ${aiStatus.provider.toUpperCase()} (${aiStatus.modelName}) - Status: ${aiStatus.status}`);

  // Reconcile overdue reminders on startup and start scheduler
  try {
    const recResult = await ReminderService.reconcileOverdueReminders();
    if (recResult.reconciledCount > 0) {
      console.log(`⏱️ Reminder Reconciliation: ${recResult.reconciledCount} overdue reminder(s) updated.`);
    }
    ReminderService.startScheduler();
    console.log(`🔔 Reminder Scheduler: Active (5s evaluation heartbeat)`);
  } catch (err) {
    console.warn(`⚠️ Reminder reconciliation warning: ${err.message}`);
  }

  console.log('========================================================');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Backend port collision: Port ${config.port} is already in use by another process.`);
    process.exit(1);
  }
  console.error(`❌ Backend server error:`, err.message);
  process.exit(1);
});

// Graceful shutdown handling
function handleShutdown(signal) {
  console.log(`\nReceived ${signal}. Shutting down NOVA Backend Server gracefully...`);
  server.close(async () => {
    await closePool();
    console.log('Server and database connections closed. Goodbye.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
