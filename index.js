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

app.post('/products', (req, res) => {
    const { category, name, description, price } = req.body;
    db.run('INSERT INTO products (category, name, description, price) VALUES (?, ?, ?, ?)', [category, name, description, price], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            message: 'Product added successfully',
            product: {
                id: this.lastID,
                category: category,
                name: name,
                description: description,
                price: price
            }
        });
    });
});

// Read all products
app.get('/products', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            message: 'Products retrieved successfully',
            products: rows
        });
    });
});

app.get('/products/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({
            message: 'Product retrieved successfully',
            product: row
        });
    });
});

// Update product
app.put('/products/:id', (req, res) => {
    const { category, name, description, price } = req.body;
    const id = req.params.id;
    db.run('UPDATE products SET category = ?, name = ?, description = ?, price = ? WHERE id = ?', [category, name, description, price, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            message: 'Product updated successfully',
            id: id
        });
    });
});

// Delete product
app.delete('/products/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM products WHERE id = ?', id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            message: 'Product deleted successfully',
            id: id
        });
    });
});




// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
