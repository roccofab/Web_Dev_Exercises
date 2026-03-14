require('dotenv').config();  //load enviroment variables from .env
//As soon as the server is started, the connection to the sqlite database is immediately established.
require('./models/connection');   
const express = require('express')  
const session = require('express-session');
const path = require('path');
const controller = require('./controllers/productsController');
const authCtrl = require('./controllers/authController');


const app = express();
const PORT = process.env.PORT || 3000;   

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('./assets'));
app.use(express.urlencoded({extended:true}));  //middleware to parse URL-encoded data from the request body
app.use(express.json());   //middleware to parse JSON data from the request body
app.use(session({   //session configuration for user authentication and management
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // HTTP only for development, set to true if you use reverse proxy with HTTPS
        maxAge: 3600000 // session expires after 1 hour
    }
}));

app.use((req, res, next) => {
    // Middleware to set Cache-Control header to prevent caching of protected pages
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

app.get('/login', (req, res) => res.render('login', { error: null }));  //render login page
app.post('/login', authCtrl.login);  //handle login form submission and user authentication
app.get('/logout', (req, res) => {  //handle user logout by destroying the session and redirecting to the login page
    req.session.destroy((err) => {
        // In case of an error during session destruction, log the error and redirect to the products page else clear the session cookie and redirect to the login page
        if (err) return res.redirect('/dbProducts');
        res.clearCookie('connect.sid'); // Cancella il cookie di sessione
        res.redirect('/login');
    });
});

app.get('/addUser', authCtrl.isAuthenticated, (req, res) => {
    res.render('addUser'); 
});


app.get('/dbProducts', authCtrl.isAuthenticated, controller.booksFromDb);   //render the products page with data from books.json if the user is authenticated, otherwise redirect to the login page
app.get('/addProduct', authCtrl.isAuthenticated, controller.showAddPage);  //render the add product page


app.post('/add', authCtrl.isAuthenticated, controller.addBook);   //handle the form submission for adding a new book and redirect to the products page
app.post('/delete', authCtrl.isAuthenticated, controller.deleteBooks);   //handle the form submission for deleting books and send a response indicating success or failure
app.post('/update', authCtrl.isAuthenticated, controller.updateBook);    //handle the form submission for updating a book and send a response indicating success or failure
app.post('/updateQty', authCtrl.isAuthenticated, controller.updateQty);  //handle the form submission for updating the quantity of a book and send a response indicating success or failure
app.post('/register', authCtrl.isAuthenticated, authCtrl.registerUser);  //handle the form submission for user registration and render the registration page with a success message or an error message
app.post('/deleteUser', authCtrl.isAuthenticated, authCtrl.deleteUser); //handle the form submission for deleting user/users

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} at url: http://localhost:${PORT}/login`);
});