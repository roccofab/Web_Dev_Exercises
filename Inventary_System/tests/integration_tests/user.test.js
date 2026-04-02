const {getUserByUsername,getUsers, createUserCredentials,deleteUserCredentials} = require('../../models/userModel')
const conn = require('../../models/connection')

describe('User Model Integration Tests', () => {

    beforeEach(() => {
        // Clear the users and credentials tables before running tests
        conn.exec('DELETE FROM credentials;');
        conn.exec('DELETE FROM users;');
    });

    test('createUserCredentials must create a new user and its credentials', () => {
        const name = "John Doe";
        const role = "user";
        const username = "john_doe";
        const password = "hashed_password_456";

        
        const success = createUserCredentials(name, role, username, password);
        expect(success).toBe(true);

    
        const userInDb = getUserByUsername(username);
        
        expect(userInDb).toBeDefined();
        expect(userInDb.name).toBe(name);
        expect(userInDb.role).toBe(role);
      
        expect(userInDb.password_digest).toBe(password);
    });

    test("deleteUserCredentials must delete a user and its credentials", () => {
       
        createUserCredentials("USER TO DELETE", "user", "delete_me", "secret");
        const user = getUserByUsername("delete_me");
        const userId = user.id;

      
        const deleted = deleteUserCredentials(userId);
        expect(deleted).toBe(true);

       
        const userAfter = getUserByUsername("delete_me");
        expect(userAfter).toBeUndefined();

        const allUsers = getUsers();
        expect(allUsers).toHaveLength(0);
    });
});