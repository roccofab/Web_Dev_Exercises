require('dotenv').config();

console.log("🔧 Initializing database...");

// create tables
require('./create_tables');

// init admin
require('./init_admin');

console.log("Database created");