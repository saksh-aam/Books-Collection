const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();
const {
    createBook,
    getAllBooks,
    getFilteredBooks,
    getBookById,
    updateBook,
    deleteBook
} = require('./books-controller');

// Middleware to authenticate user
function authenticateUser(req, res, next) {
    // Get token from request header
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Authentication failed" });
    }
    // Verify token
    jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET, (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decodedToken;
        next();
    });
}

// Create a new book
router.post('/books',authenticateUser, createBook);

// Get all books
router.get('/books',authenticateUser, getAllBooks);

// Get filtered books
router.get('/filteredbooks',authenticateUser, getFilteredBooks);

// Get a single book by id
router.get('/books/:id',authenticateUser, getBookById);

// Update a book by id
router.put('/books/:id',authenticateUser, updateBook);

// Delete a book by id
router.delete('/books/:id',authenticateUser, deleteBook);

module.exports = router;
