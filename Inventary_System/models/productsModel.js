const fs = require('fs').promises
const path = require('path');
const booksFile = path.join(__dirname, 'books.json')

async function getBooks(){
    try {
        const raw = await fs.readFile(booksFile, 'utf-8');
        return JSON.parse(raw);
    } catch (error) {
        return []; 
    }
}

async function addBook(title,price,author,category){
    const books = await getBooks();
    let newId = 1;

    if (books.length > 0) {
        // sort by id and get the last one
        books.sort((a, b) => a.id - b.id);
        newId = books[books.length - 1].id + 1;
    }

    const newBook = {id:newId,
         title:title,
         price:parseFloat(price) || 0,
         author:author,
         category:category
        };  //crea nuovo libro
    books.push(newBook);  //add a new book at the end of the array

    await fs.writeFile(booksFile, JSON.stringify(books, null, 2));  //overwrite books.json
} 

async function deleteBooks(ids){
    const data = await getBooks();

    const numeric_ids = ids.map(id => Number(id));  //cast ids from string to number

    let updatedBooks = [];  //This list contains books excluding those that match the specified ids.
    for(let i = 0; i < data.length; i++){
        const current = data[i];

        if(numeric_ids.includes(current.id))
            console.log(`Deleting Book:  ${current.title}`);
        else
            updatedBooks.push(current);
    }

    await fs.writeFile(booksFile, JSON.stringify(updatedBooks, null, 2));
}

async function updateBook(id, title, price, author,category, quantity){
    const books = await getBooks();
    const numericId = Number(id);  //cast id from string to number
    const index = books.findIndex(b => b.id === numericId);

    if(index != -1){
        books[index] = {
            id : numericId,
            title : title,
            price : parseFloat(price) || 0,
            author : author,
            category : category,
            quantity: parseInt(quantity) || 0
        };
        await fs.writeFile(booksFile, JSON.stringify(books, null, 2));
    }
}

/**
 * Utility function to add the attribute quantity for each book, the value of quantity is a random number between 1 and 100
 */
async function addRandomQty() {
    const books = await getBooks();
    try{
        for(let i = 0; i < books.length; i++){
            books[i].quantity = Math.floor(Math.random() * 100) + 1;  //generate a random quantity value between 1 and 100
        }

        await fs.writeFile(booksFile, JSON.stringify(books, null, 2));
        console.log("Quantity added");
    }catch(error){
        console.error('error while adding quantity: ', error);
    }
}

/**
 * Routine to search a book in books.json by its id and updates the quantity field by appending the value
 *     num: if num is positive the quantity increase else the quantity decreases.
 * If the resulting quantity is 0 or negative the book is removed from the list by using splice function.
 * 
 * Frontend Flow:
 *     - User select a book, enter the quantity to remove and press delete.
 *     - The function updateQty update quantity field in books.json
 *     -The page is reloaded.
 *  
 * @param {Number} id 
 * @param {Number} num  -negative number that represent the decrement 
 * @returns 
 */
async function updateQty(id, num){
    const books = await getBooks();
    const numericId = Number(id);

    const index = books.findIndex(b => b.id === numericId);

    if(index == -1)
        return;

    books[index].quantity += num;   //num must be negative

    if(books[index].quantity <= 0){
        books.splice(index, 1);
    }

    await fs.writeFile(booksFile, JSON.stringify(books, null, 2));
}

module.exports = { getBooks,
     addBook,
     deleteBooks,
     updateBook,
     addRandomQty,
    updateQty 
};

