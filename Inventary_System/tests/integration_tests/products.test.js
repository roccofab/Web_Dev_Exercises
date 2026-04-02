const {getBooks, addBook, deleteBooks, updateBook, updateQty, updateSection} = require('../../models/productsModel')
const conn = require('../../models/connection')

describe("Database Integration Tests - Books", () => {
    
    // clear workspace before each test
    beforeEach(() => {
        conn.prepare("DELETE FROM books").run();
    });

    //ADD BOOK TESTING
    test("addBook must add a new record into the table books", async() =>{
        await addBook("Book Test", 29.89, "Author Test", "Test Category", 20, "F");
        const books = await getBooks();

        expect(books).toHaveLength(1);
        expect(books[0].title).toBe("Book Test");
        expect(typeof books[0].price).toBe("number");
        expect(books[0].author).toBe("Author Test");
        expect(books[0].category).toBe("Test Category");
        expect(typeof books[0].quantity).toBe("number");
        expect(books[0].section).toBe("F" || "A");
    });

    //DELETE BOOK TESTING
    test("deleteBooks must delete the input quantity: if input == available quantity then delete the record", async() => {
        await addBook("Book 1", 10, "A1", "C1", 5, "A");
        await addBook("Book 2", 20, "A2", "C2", 10, "B");
        await addBook("Book 3", 30, "A3", "C3", 15, "C");

        let books = await getBooks();
        const id1 = books[0].id;
        const id2 = books[1].id;
        const id3 = books[2].id;

        await deleteBooks([id1,id2]);
        const booksUpdated = await getBooks();

        expect(booksUpdated).toHaveLength(1);
        expect(booksUpdated[0].title).toBe("Book 3");
        expect(typeof booksUpdated[0].price).toBe("number");
        expect(booksUpdated[0].author).toBe("A3");
        expect(booksUpdated[0].category).toBe("C3");
        expect(typeof booksUpdated[0].quantity).toBe("number");
        expect(booksUpdated[0].section).toBe("C");
    });


    //UPDATE BOOK TESTING
    test("updateBook must update one or more value of a selected row", async() => {
        await addBook("Not Updated Book", 14.50, "Not Updated author", "Not Updated Category", 10, "F");
        const books = await getBooks();
        const id = books[0].id;

        await updateBook(id, "Updated Title", 16.50, "Updated Author", "Updated Category", 20, "A");

        const updatedBooks = await getBooks();
        const book = updatedBooks[0];

        expect(book.title).toBe("Updated Title");
        expect(book.price).toBe(16.50);
        expect(book.author).toBe("Updated Author");
        expect(book.category).toBe("Updated Category");
        expect(book.quantity).toBe(20);
        expect(book.section).toBe("A");
    });

    //UPDATE QUANTITY TESTING
    test("updateQty must update the value of quantity column", async () => {
        await addBook("Book Qty", 10, "Author Qty", "Cat Qty", 10, "A");
        const id = (await getBooks())[0].id;

    
        await updateQty(id, 5);
        let book = (await getBooks())[0];
        expect(book.quantity).toBe(15);

        
        await updateQty(id, -3);
        book = (await getBooks())[0];
        expect(book.quantity).toBe(12);
    });

    //UPDATE SECTION TESTING
    test("updateSection must update the value of section column", async () =>{
        await addBook("Book Section", 20.90, "Author Section", "Cat Section", 10, "B");
        const id=(await getBooks())[0].id;

        await updateSection(id, "F");
        let book = (await getBooks())[0];
        expect(book.section).toBe("F");
    });

});