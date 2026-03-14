require('dotenv').config();
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');


/**
 * app_data.db database initialization script.
 * The script performs the following functions:
 *    - Use better-sqlite3 driver to comunicate with the sqlite3 database: better-sqlite3 is a library for synchronous
 *          interaction with sqlite3, it is faster than sqlite3 library that use an asynchronous model to comunicate with sqlite3 database.
 * 
 *    - Load DB_PATH from .env
 * 
 *    - Initialize data for a new admin user to log in to the system for the first time.
 * 
 *    - Hash password by using bcrypt algorithm, the password is hashed in 10 rounds.
 * 
 *    - Performs an atomic transaction on SQLite to ensure data integrity
 *          between the 'users' (profile) and 'credentials' (authentication) tables.
 *
 *@requires dotenv 
 *@requires better-sqlite3  - driver fron sinchronous interaction with the selite3 database
 *@requires bcrypt   -safe password hashing algorithm
 */

const dbPath = process.env.DB_PATH;

const db = new Database(dbPath);

const admin = {
    name : 'admin',
    role: 'ADMINISTRATOR',
    username: 'admin_test',
    password: 'admin.systemTest1'
};

const hash = bcrypt.hashSync(admin.password,10);

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

console.log("Admin created");