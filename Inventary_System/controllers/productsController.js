const data = require('../models/productsModel');
const userModel = require('../models/userModel');

/**
 * Retrieves books from the database and renders the products page:
 * 
 *     -the function retrieves the list of books from the database using  productsModel.getBooks  from the data model,
 *    
 *     -if the user is authenticated, it also retrieves the current user's information from the session
 *        and checks if the user has an administrator role to retrieve the list of users.
 *    
 *     -Finally, it renders the products page with the retrieved books, current user information, and users list (if user is an administrator).
 * @param {*} req 
 * @param {*} res 
 */
async function booksFromDb(req, res) {
    try {
        const books = await data.getBooks();
        const currentUser = req.session.user; // Retrieve the current user from the session

        let usersList = [];
        if(currentUser && currentUser.role == "ADMINISTRATOR"){
            usersList = await userModel.getUsers(); // Retrieve the list of users if the current user is an administrator
        }

        // Render the products page with the retrieved books, current user information, and users list (if user is an administrator)
        res.render('productsPage', { user: currentUser || null, books: books, users: usersList });
    } catch (error) {
        res.status(500).send("error while retrieving data");
        console.log(error);
    }
}

/**
 * Renders the add product page
 * @param {*} req 
 * @param {*} res 
 */
async function showAddPage(req, res) {
    try {
        res.render('addProd');
    } catch (error) {
        res.status(500).send("error while retrieving Add Product Page");
        console.log(error);
    }
}

/**
 * Adds a new book to the database with the provided title, price, author, and category:
 * 
 *    -the function retrieves the title, price, author, and category from the request body,
 *         if the title or price is missing, it responds with a 400 status code and an error message.
 *    
 *    -If the data is valid, it calls the productsModel.addBook from the data model to add the new book to the database and
 *        redirects to the dbProducts page.
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function addBook(req, res) {
    try {
        const { title, price, author = "", category="", quantity, section } = req.body;
        const priceNum = parseFloat(price);  //parse price to a float number
        if (!title || isNaN(priceNum)) 
            return res.status(400).send("Please enter at least the product title and price");

        await data.addBook(title, priceNum, author, category, quantity, section);
        res.redirect('/dbProducts');
    } catch (error) {
        res.status(500).send("Error while adding new Product");
        console.log(error);
    }
}

/**
 * Deletes books from the database based on the provided IDs:
 *    
 *    -the function retrieves the IDs of the books to be deleted from the request body,
 *        if no IDs are provided, it responds with a 400 status code and an error message.
 *    
 *    -If the IDs are valid, it calls productsModel.deleteBooks function from the data model to delete the specified books from the database(200 code status).
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function deleteBooks(req, res) {
    try{
        const ids = req.body.ids;
        if(!ids || ids.length === 0)  return res.status(400).send("No ID found");

        await data.deleteBooks(ids);
        res.sendStatus(200);
    }catch(error){
        console.error(error);
        res.status(500).send("error while deleting books");
    }
}

/**
 * Updates a book in the database with the provided ID, title, price, author, and category:
 * 
 *     -the function retrieves the ID, title, price, author, and category from the request body,
 *     
 *     -if the ID, title, or price is missing, it responds with a 400 status code and an error message.
 *    
 *     -If the data is valid, it calls  productsModel.updateBook function from the data model to update the specified book in the database(200 code status).
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function updateBook(req,res){
    try{
        const { id, title, price, author, category, quantity, section } = req.body;
        if (!id || !title || !price) {
            return res.status(400).send("Missing Data");
        }

        await data.updateBook(id, title, price, author, category, quantity, section);
        res.sendStatus(200);
    }catch(error){
        console.error(error);
        res.status(500).send("Errore while update book");
    }
}

/**
 * Updates the quantity of a book in the database:
 * 
 *     -the function retrieves the ID and delta (change in quantity) from the request body,
 *          if the ID or delta is missing or not a valid number, it responds with a 400 status code and an error message.
 *     
 *     -If the data is valid, it calls productsModel.updateQty method from the data model to update the quantity of the specified book in the database(200 code status).
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
async function updateQty(req, res) {
    try {
        const { id, delta } = req.body;

        if (!id || Number.isNaN(Number(delta)))
            return res.status(400).send("Not Valid Data");

        await data.updateQty(id, Number(delta));
        res.sendStatus(200);

    } catch (error) {
        console.error(error);
        res.status(500).send("Errore update qty");
    }
}

/**
 * Updates the section of a book in the database.
 * @param {*} req - The request object.
 * @param {*} res - The response object.
 * @returns {Promise<void>} 
 */
async function updateSection(req,res) {
    try{
        const { id, section } = req.body;
            if (!id || !section) {
                return res.status(400).send("Missing id or section");
            }
            const safeSection = section || 'A';
             await data.updateSection(id, safeSection);

        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating section: " + error.message);
    }
}

module.exports = {
    booksFromDb,
    showAddPage,
    addBook,
    deleteBooks,
    updateBook,
    updateQty,
    updateSection
}