const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors middleware

const app = express();
const port =process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

// Connect to SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create product

app.post('/books', (req, res) => {
    const {name,img,summary} = req.body;
    db.run('INSERT INTO books (name,img,summary) VALUES (?, ?, ?)', [name,img, summary], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            message: 'books added successfully',
            product: {
                id: this.lastID,
                name: name,
                img: img,
                summary:summary,
            }
        });
    });
});

// Read all products
app.get('/books', (req, res) => {
    db.all('SELECT * FROM books', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            message: 'books retrieved successfully',
            books: rows
        });
    });
});

app.get('/books/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({
            message: 'Book retrieved successfully',
            book: row
        });
    });
});

// Update product
app.put('/books/:id', (req, res) => {
    const { name,img,summary} = req.body;
    const id = req.params.id;
    db.run('UPDATE books SET name = ?, img = ?, summary = ? WHERE id = ?', [name,img,summary,id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            message: 'book updated successfully',
            id: id
        });
    });
});

// Delete product
app.delete('/books/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM books WHERE id = ?', id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            message: 'book deleted successfully',
            id: id
        });
    });
});




// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
