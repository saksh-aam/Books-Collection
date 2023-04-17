const Books = require("./books");
const { bookValidation } = require("../validation");
const { default: mongoose } = require("mongoose");

// Create a new book
module.exports.createBook = async (req, res) => {
    try {
        const { error } = bookValidation(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const book = new Books(req.body);
        await book.save();
        res.status(201).json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all books
module.exports.getAllBooks = async (req, res) => {
    try {
        // Extract query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sort = req.query.sort || '';

        // Construct sort object from sort query parameter
        const sortObj = {};
        if (sort) {
            const sortFields = sort.split(',');
            sortFields.forEach((field) => {
                let sortOrder = 1;
                if (field.startsWith('-')) {
                    sortOrder = -1;
                    field = field.substring(1);
                }
                sortObj[field] = sortOrder;
            });
        }

        // Compute pagination values
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        // Fetch books from database
        const books = await Books.find({})
            .sort(sortObj)
            .skip(startIndex)
            .limit(limit);

        // Get total count of books
        const totalCount = await Books.countDocuments({});

        // Construct result object
        const result = {
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
            items: books,
        };

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Filtering
module.exports.getFilteredBooks = async (req, res) => {
    try {
        const perPage = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort || '';
        const filter = {};

        // Extract filter parameters and add them to the filter object
        if (req.query.filter) {
            const filterParams = req.query.filter.split(',');
            filterParams.forEach((param) => {
                const [key, value] = param.split(':');
                filter[key] = value;
            });
        }

        // Extract sort parameters and add them to the sort object
        const sortObj = {};
        if (sort) {
            const sortFields = sort.split(',');
            sortFields.forEach((field) => {
                let sortOrder = 1;
                if (field.startsWith('-')) {
                    sortOrder = -1;
                    field = field.substring(1);
                }
                sortObj[field] = sortOrder;
            });
        }

        const books = await Books.find(filter)
            .sort(sortObj)
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();

        const count = await Books.countDocuments(filter);

        res.status(200).json({
            books,
            currentPage: page,
            totalPages: Math.ceil(count / perPage),
            totalBooks: count,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get a single book by id
module.exports.getBookById = async (req, res) => {
    try {
        const bookId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({ message: 'Invalid book ID' });
        }
        const book = await Books.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a book by id
module.exports.updateBook = async (req, res) => {
    try {
        const book = await Books.findById(req.params.id);
        const { error } = bookValidation(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        if (book == null) {
            return res.status(404).json({ message: 'Book not found' });
        }
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.description = req.body.description || book.description;
        book.publishDate = req.body.publishDate || book.publishDate;
        const updatedBook = await book.save();
        res.json(updatedBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a book by id
module.exports.deleteBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const book = await Books.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        await book.deleteOne();
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};