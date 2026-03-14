const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * Handles user login by verifying the provided username and password against the stored credentials in the database.
 * If the credentials are valid, it creates a session for the user and redirects them to the dbProducts page.
 * If the credentials are invalid, it renders the login page with an error message.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function login(req,res){
    const { username, password } = req.body;
    try{
        const user = userModel.getUserByUsername(username);
        if(user){
            const passwordMatch = await bcrypt.compare(password, user.password_digest);
            if(passwordMatch){
                req.session.user = { id: user.id, name: user.name, role: user.role};
                return res.redirect('/dbProducts');
            }
        }
        return res.render('login', { error: "Not Valid username or password" });
    }catch(err){
        console.error("Error while login:", err);
        res.render('login', { error: "Internal Server Error" });
    }
}

/**
 * Handles user registration by creating a new user in the database with the provided name, role, username, and password.
 * The password is hashed using bcrypt before being stored in the database.
 * If the registration is successful, it redirects the user to the dbProducts page. 
 * If there is an error during registration, it logs the error and responds with a 500 status code and an error message.
 * @param {*} req 
 * @param {*} res 
 */
async function registerUser(req,res){
    const { name, role, username, password } = req.body;
    try{
        const passwordDigest = await bcrypt.hash(password, saltRounds);
        userModel.createUserCredentials(name, role, username, passwordDigest);
        res.redirect('/dbProducts');
    }catch(err){
        console.error("Error while registering user:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 *  Middleware function to check if the user is authenticated before allowing access to protected routes.
 *  If the user is authenticated, the function calls next() to proceed to the next route handler. 
 *  If the user is not authenticated, it redirects them to the login page.
 * @param {*} req  
 * @param {*} res 
 * @param {*} next  -
 * @returns 
 */
function isAuthenticated(req, res, next) {
    // Middleware to check if the user is authenticated before allowing access to dbProducts route
    if (req.session.user) {
        return next(); // User is authenticated, proceed to the next route handler
    }
    res.redirect('/login'); // User is not authenticated, redirect to login
}

/**
 * function to delete user(s) from the database based on the provided user ID from the request body.
 * The function checks if the userIds parameter is valid and then iterates through the array of user
 *     IDs to delete each user using the userModel.deleteUser method.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
function deleteUser(req, res) {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds)) {
        return res.status(400).json({ message: "Invalid user IDs" });
    }

    try{
        for(const id of userIds){
            userModel.deleteUserCredentials(id);
        }
        res.status(200).json({ message: "Users deleted successfully" });
    }catch(err){
        console.error("Error while deleting users:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    login,
    registerUser,
    isAuthenticated,
    deleteUser
}