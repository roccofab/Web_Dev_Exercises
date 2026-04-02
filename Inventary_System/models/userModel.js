const db = require('./connection');

/**
 * Retrieves user profile and its associated authentication credentials from app_data.db
 *    the function performs an INNER JOIN SQL query between  users and credentials tables based on the provided username,
 *     unique user ID is the relational key. 
 *    This method utilizes a prepared statement to prevent SQL injection and ensure high-performance execution via better-sqlite3.
 *    and returns the user data if found.
 * @param {String} username 
 * @returns {Object|undefined} 
 */
function getUserByUsername(username){
   const stmt = db.prepare(`
        SELECT users.id, users.name, users.role, credentials.password_digest
        FROM users
        JOIN credentials ON users.id = credentials.id
        WHERE credentials.username = ?
    `);

    return stmt.get(username);
}

/**
 * Retrieves all users from the database app_data.bd:
 *    the function performs a SQL query to select the name and role of all users from the users table,
 *    and returns an array of user objects containing the name and role of each user.
 * @returns {Array<Object>}  -array of user objects
 * @throws {Error} If the database query fails or the table does not exist.
 */
function getUsers(){
    const stmt = db.prepare(`
        SELECT id, name, role FROM users
    `);

    return stmt.all();
}

/**
 * Creates a new user and their associated credentials in the app_data.db within a single atomic transaction.
 *    the function performs a SQL transaction to insert a new user into the users table and their corresponding credentials into the credentials table.
 *    If any of the database operations fail, the transaction is rolled back to maintain data integrity.
 * @param {String} name 
 * @param {String} role 
 * @param {String} username 
 * @param {String} password 
 * @returns 
 */
function createUserCredentials(name, role, username, password){
    const insertUser = db.prepare(`
        INSERT INTO users (name, role)
        VALUES (?, ?)
    `);

    const insertCred = db.prepare(`
        INSERT INTO credentials (id, username, password_digest)
        VALUES (?, ?, ?)
    `);

    const transaction = db.transaction(() => {

        const result = insertUser.run(name, role);

        insertCred.run(
            result.lastInsertRowid,
            username,
            password
        );

    });

    transaction();

    return true;
}

/**
 *  Deletes a user and their associated credentials via cascading referential integrity.
 *  This function removes a record from the 'users' table and  due to the 'ON DELETE CASCADE' 
 *     constraint configured in the database schema, the corresponding entries in the 
 * '   credentials' table are automatically deleted by the sqlite engine to maintain consistency.
 * @param {*} id 
 * @returns 
 */
function deleteUserCredentials(id) {
  const stmt = db.prepare(`DELETE FROM users WHERE id = ?`);
  const result = stmt.run(id);
  return result.changes > 0;
}

module.exports = {
    getUserByUsername,
    getUsers,
    createUserCredentials,
    deleteUserCredentials
}