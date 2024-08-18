const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Book = require('./models/Book');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/library', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const secretKey = 'your-secret-key'; // Mantenha isso em um local seguro

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Registro de usuário
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    try {
        await user.save();
        res.status(201).send('User registered');
    } catch {
        res.status(400).send('Error registering user');
    }
});

// Login de usuário
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user == null) return res.status(400).send('Cannot find user');

    try {
        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ username: user.username }, secretKey);
            res.json({ token });
        } else {
            res.status(400).send('Invalid credentials');
        }
    } catch {
        res.status(500).send('Server error');
    }
});

// CRUD de livros
app.post('/books', authenticateToken, async (req, res) => {
    const book = new Book(req.body);
    await book.save();
    res.status(201).send(book);
});

app.get('/books', authenticateToken, async (req, res) => {
    const books = await Book.find();
    res.json(books);
});

app.delete('/books/:id', authenticateToken, async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
});

app.listen(port, () => console.log(`Server running on port ${port}`));
