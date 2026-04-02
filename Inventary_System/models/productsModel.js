const db = require('./connection');

/**
 * Get the products from the table books.
 * @returns {Array<Object>}   Array of books object
 */
async function getBooks() {
  const stmt = db.prepare(`
    SELECT *
    FROM books
    ORDER BY id
  `);
  return stmt.all();
}

/**
 * Insert a new row in the database app_data.db, the quantity is first set to 0.
 */
async function addBook(title, price, author, category, quantity, section) {
  const stmt = db.prepare(`
    INSERT INTO books (title, price, author, category, quantity, section)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  await stmt.run(title, parseFloat(price), author || '', category || '', parseInt(quantity, 10) || 0, section);
}

/**
 * Delete a specific book identified by its id.
 */
async function deleteBooks(ids) {
  const transaction = db.transaction((ids) => {
    const stmt = db.prepare(`
      DELETE FROM books
      WHERE id = ?
    `);

    for (const id of ids) {
      stmt.run(Number(id));
    }
  });

  transaction(ids);
}

/**
 * Update one or more fields of a specific row.
 */
async function updateBook(id, title, price, author, category, quantity, section) {
  const stmt = db.prepare(`
    UPDATE books
    SET title = ?,
        price = ?,
        author = ?,
        category = ?,
        quantity = ?,
        section = ?
    WHERE id = ?
  `);

  await stmt.run(title, parseFloat(price), author, category, parseInt(quantity, 10) || 0, section || 'A', Number(id));
}

/**
 * Utility function to add the attribute quantity for each book, the value of quantity is a random number between 1 and 100.
 */
async function addRandomQty() {
  const books = db.prepare('SELECT id FROM books').all();

  const transaction = db.transaction(() => {
    const stmt = dbprepare(`
      UPDATE books
      SET quantity = ?
      WHERE id = ?
    `);

    for (const book of books) {
      const randomQty = Math.floor(Math.random() * 100) + 1;
      stmt.run(randomQty, book.id);
    }
  });

  transaction();
}

/**
 * Update the quantity of a book, deleting it if the result is 0 or less.
 */
async function updateQty(id, num) {
  const book = await db.prepare(`
    SELECT quantity
    FROM books
    WHERE id = ?
  `).get(Number(id));

  if (!book) return;

  const newQty = book.quantity + num;

  if (newQty <= 0) {
    await db.prepare(`
      DELETE FROM books
      WHERE id = ?
    `).run(Number(id));
    return;
  }

  await db.prepare(`
    UPDATE books
    SET quantity = ?
    WHERE id = ?
  `).run(newQty, Number(id));
}

async function updateSection(id, newSection) {
  const rangeSections = ['A', 'B', 'C', 'D', 'E', 'F'];
  if (!rangeSections.includes(newSection)) {
    throw new Error('Invalid section: must be A, B, C, D, E, F');
  }

  const book = await db.prepare(`
    SELECT section
    FROM books
    WHERE id = ?
  `).get(Number(id));

  if (!book) return;

  const stmt = db.prepare(`
    UPDATE books
    SET section = ?
    WHERE id = ?
  `);
  await stmt.run(newSection, Number(id));
}

module.exports = {
  getBooks,
  addBook,
  deleteBooks,
  updateBook,
  addRandomQty,
  updateQty,
  updateSection,
};

