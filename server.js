const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const Book = require('./bookModel');

const app = express();
app.use(express.static('public'));
app.use(express.json());

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

mongoose.connect('mongodb://localhost:27017/biblioteca', { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/books', upload.single('cover'), async (req, res) => {
    try {
        const { title, author, year, synopsis } = req.body;
        const newBook = new Book({
            title,
            author,
            year,
            synopsis,
            cover: req.file.filename
        });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar o livro' });
    }
});

app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar os livros' });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
