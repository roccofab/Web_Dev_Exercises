
const Database = require('better-sqlite3');
const path = require('path');

/**
 * Script to connect to the sqlite3 app_data.db database that follows the Singleton Design Pattern.
 * 
 * This module initializes and exports a single, persistent connection to the sqlite3 database
 * using the 'better-sqlite3' driver. By maintaining a long-lived connection, the system 
 * avoids the significant overhead associated with opening and closing file handles for 
 * every individual transaction.
 * * Key Configurations:
 *   - Foreign Keys: Enabled to ensure relational integrity.
 *   - WAL Mode (Write-Ahead Logging): Enhances concurrency, allowing readers not to block 
 *       writers and significantly improving write performance.
 *   - Synchronous Normal: Balances safety and speed, providing a high-performance 
 *       environment suitable for most application workloads.
 */

const dbPath = path.join(__dirname, 'data', 'app_data.db');

const db = new Database(dbPath);

console.log("Connected to SQLite database");

db.exec(`
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
`);

module.exports = db;