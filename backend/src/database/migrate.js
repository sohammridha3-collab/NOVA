/**
 * NOVA Backend — Database Migration Runner
 * Creates database if needed, executes SQL migrations in order,
 * tracks applied migrations in `_migrations`, and seeds the default single-owner user.
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { config } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MIGRATIONS_DIR = path.resolve(__dirname, 'migrations');

/**
 * Hash a password with salt using native Node crypto.
 */
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify a password against a stored salt:hash string.
 */
export function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, key] = storedHash.split(':');
  const keyBuffer = Buffer.from(key, 'hex');
  const derivedBuffer = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(keyBuffer, derivedBuffer);
}

export async function runMigrations() {
  console.log('----------------------------------------------------');
  console.log('NOVA Backend — Database Migration Runner');
  console.log(`Target: ${config.db.host}:${config.db.port} | Database: ${config.db.database}`);
  console.log('----------------------------------------------------');

  let adminConn = null;
  try {
    // 1. Connect without selecting database to guarantee database exists
    adminConn = await mysql.createConnection({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password
    });

    console.log(`[1/4] Ensuring database '${config.db.database}' exists...`);
    await adminConn.query(
      `CREATE DATABASE IF NOT EXISTS \`${config.db.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await adminConn.end();
    adminConn = null;

    // 2. Connect to the database with multipleStatements enabled for migrations
    const dbConn = await mysql.createConnection({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      multipleStatements: true
    });

    // 3. Create migrations tracking table
    console.log('[2/4] Ensuring migrations tracking table exists...');
    await dbConn.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. Read migration files
    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort();

    const [appliedRows] = await dbConn.query('SELECT name FROM _migrations');
    const appliedSet = new Set(appliedRows.map(r => r.name));

    console.log(`[3/4] Processing ${files.length} migration file(s)...`);

    for (const file of files) {
      if (appliedSet.has(file)) {
        console.log(`  - ${file}: [ALREADY APPLIED]`);
        continue;
      }

      console.log(`  - Applying ${file}...`);
      const sqlContent = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');

      // Execute migration in transaction
      await dbConn.beginTransaction();
      try {
        await dbConn.query(sqlContent);
        await dbConn.query('INSERT INTO _migrations (name) VALUES (?)', [file]);
        await dbConn.commit();
        console.log(`  ✓ Applied ${file} successfully.`);
      } catch (migrationErr) {
        await dbConn.rollback();
        throw migrationErr;
      }
    }

    // 5. Seed Single Owner Account if none exists
    console.log('[4/4] Verifying single-owner account seed...');
    const [userRows] = await dbConn.query('SELECT id, username FROM users LIMIT 1');
    if (userRows.length === 0) {
      const ownerId = crypto.randomUUID();
      const pwdHash = hashPassword(config.auth.ownerPassword);
      await dbConn.query(
        'INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)',
        [ownerId, config.auth.ownerUsername, pwdHash, 'owner']
      );
      console.log(`  ✓ Created default owner account: '${config.auth.ownerUsername}'`);
    } else {
      console.log(`  - Owner account exists: '${userRows[0].username}'`);
    }

    // Seed default preferences if none exist
    const [prefRows] = await dbConn.query("SELECT id FROM preferences WHERE id = 'user_settings'");
    if (prefRows.length === 0) {
      const defaultSettings = {
        themeAccent: 'cyan',
        reducedMotion: false,
        ttsEnabled: true,
        speechRate: 1.0,
        speechPitch: 1.0,
        voiceURI: 'default'
      };
      await dbConn.query(
        'INSERT INTO preferences (id, settings_json) VALUES (?, ?)',
        ['user_settings', JSON.stringify(defaultSettings)]
      );
      console.log('  ✓ Seeded default user preferences');
    }

    await dbConn.end();
    console.log('\n====================================================');
    console.log('MIGRATIONS COMPLETED SUCCESSFULLY!');
    console.log('====================================================');
    return true;
  } catch (err) {
    if (adminConn) await adminConn.end().catch(() => {});

    console.error('\n❌ MIGRATION FAILED:');
    console.error(`Error Code: ${err.code || 'UNKNOWN'}`);
    console.error(`Message: ${err.message}`);

    console.error('\nTROUBLESHOOTING GUIDE:');
    if (err.code === 'ECONNREFUSED') {
      console.error(`- MySQL is not accepting connections at ${config.db.host}:${config.db.port}.`);
      console.error("- Ensure your MySQL server service is running ('Start-Service MySQL80' on Windows).");
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error(`- Access denied for user '${config.db.user}'.`);
      console.error('- Check DB_USER and DB_PASSWORD in backend/.env.');
    } else {
      console.error('- Verify your database configuration in backend/.env.');
    }
    return false;
  }
}

// Allow direct CLI execution: node src/database/migrate.js
if (process.argv[1] && process.argv[1].endsWith('migrate.js')) {
  runMigrations().then(success => {
    process.exit(success ? 0 : 1);
  });
}

