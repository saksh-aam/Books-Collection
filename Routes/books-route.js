const express = require('express');
const router = express.Router();
const {
    createBook,
    getAllBooks,
    getFilteredBooks,
    getBookById,
    updateBook,
    deleteBook
} = require('../Controllers/book-functions');

// Create a new book
router.post('/books', createBook);

// Get all books
router.get('/books', getAllBooks);

// Get filtered books
router.get('/filteredbooks', getFilteredBooks);

// Get a single book by id
router.get('/books/:id', getBookById);

// Update a book by id
router.put('/books/:id', updateBook);

// Delete a book by id
router.delete('/books/:id', deleteBook);

module.exports = router;
