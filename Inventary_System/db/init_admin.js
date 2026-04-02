require('dotenv').config();
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

/**
 * app_data.db database initialization script.
 * - Creates an admin user only if it does NOT already exist
 * - Safe to run multiple times (idempotent)
 */

const dbPath = process.env.DB_PATH || path.join(__dirname, "../models/data/app_data.db");
const db = new Database(dbPath);

const admin = {
    name: 'admin',
    role: 'ADMINISTRATOR',
    username: 'admin_test',
    password: 'admin.systemTest1'
};

// check if the user exists in the table
const existingUser = db.prepare(`
    SELECT * FROM credentials WHERE username = ?
`).get(admin.username);

if (existingUser) {
    console.log("Admin already exists, skipping creation");
} else {
    console.log("🔧 Creating admin user...");

    const hash = bcrypt.hashSync(admin.password, 10);

    const insertUser = db.prepare(`
        INSERT INTO users (name, role) VALUES (?, ?)
    `);

    const insertCred = db.prepare(`
        INSERT INTO credentials (id, username, password_digest)
        VALUES (?, ?, ?)
    `);

    const transaction = db.transaction(() => {
        const result = insertUser.run(admin.name, admin.role);

        insertCred.run(result.lastInsertRowid, admin.username, hash);
    });

    transaction();

    console.log("Admin created successfully");
}