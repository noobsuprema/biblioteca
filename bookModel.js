const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    year: Number,
    synopsis: String,
    cover: String
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
