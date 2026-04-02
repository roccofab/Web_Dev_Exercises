require('dotenv').config();
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname,"../models/data/app_data.db");

const db = new Database(dbPath);

db.exec(`

CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS credentials(
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_digest TEXT NOT NULL,
    FOREIGN KEY(id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS books(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    price REAL NOT NULL,
    author TEXT,
    category TEXT,
    quantity INTEGER DEFAULT 0,
    section TEXT CHECK(section IN ('A','B','C','D','E','F'))
);

CREATE INDEX IF NOT EXISTS idx_username ON credentials(username);
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);

`);

console.log("Tables created successfully");