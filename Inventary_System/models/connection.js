const Database = require('better-sqlite3');
const path = require('path');

// load enviroment variables based on the context (Test or Development)
require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

/**
 * Singleton Database Connection Module
 * * This module manages a single, persistent connection to the SQLite database using 'better-sqlite3'.
 * It is environment-aware:
 * - In Development/Production: Connects to a physical file (defined in DB_PATH).
 * - In Test Mode: Utilizes an in-memory database (:memory:) for speed and isolation.
 * * Key Configurations:
 * - Foreign Keys: Enabled for relational integrity (ON DELETE CASCADE, etc.).
 * - WAL Mode: Enabled in file-based mode for high concurrency.
 * - Auto-Initialization: Creates necessary tables automatically when running in memory.
 */

// Se DB_PATH non è definito, usa il percorso di fallback relativo
const dbPath = process.env.DB_PATH || path.join(__dirname, 'data', 'app_data.db');

const db = new Database(dbPath);

console.log(`Connected to SQLite database: ${dbPath === ':memory:' ? 'IN-MEMORY (TEST)' : dbPath}`);


db.exec(`PRAGMA foreign_keys = ON;`);


if (dbPath !== ':memory:') {
    db.exec(`
        PRAGMA journal_mode = WAL;
        PRAGMA synchronous = NORMAL;
    `);
} else {
    // SCHEMA INITIALIZATION (only for in-memory database)
    db.exec(`
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            price REAL NOT NULL,
            author TEXT,
            category TEXT,
            quantity INTEGER DEFAULT 0,
            section TEXT DEFAULT 'A'
        );

        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            role TEXT CHECK(role IN ('admin', 'user')) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS credentials (
            id INTEGER PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password_digest TEXT NOT NULL,
            FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);
}

module.exports = db;