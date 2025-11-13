const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

router.use(express.json())

const pool = new Pool({
    connectionString: "postgresql://postgres:password@localhost:5432/ims",
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillies: 2000,
});


// Create product
router.post('/products', async (req, res) => {
    const { name, amount, price, category } = req.body;

    if (!name || !amount || !price || !category) {
        res.status(400).json({
            error: "Must include 'name', 'amount', 'price' and 'catagori'."
        });
        return;
    }

    if (typeof name !== "string" || typeof category !== "string") {
        res.status(400).json({
            error: "'name' and 'catagori' must be a string."
        });
        return;
    }

    if (typeof amount !== "number" || typeof price !== "number") {
        res.status(400).json({
            error: "'amount' and 'price' must be numbers."
        });
        return;
    }

    try {
        const query = "INSERT INTO products (name,price,category,amount) VALUES ($1,$2,$3,$4) RETURNING *";
        const values = [name, price, category, amount];

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Database Fault:", error);
        res.status(500).json({
            error: "Could not create product."
        });
    };
});

// Get ALL products
router.get('/products', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM products");
        res.json(result.rows);

    } catch (error) {
        console.error("DatabaseError:", error);
        res.status(500).json({ error: "Server Fault" });
    }
});

// Get specific product with id
router.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({
            error: "'id' must be a number."
        });
        return;
    }

    //const index = products.find(find => find.id === id);



    res.json();
});

// Update specific product with id
router.put('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    // Validering ID
    if (isNaN(id)) {
        res.status(400).json({
            error: "'id' must be a number."
        });
        return;
    }

    //const index = products.findIndex(find => find.id === id);

    if (index === -1) {
        res.status(400).json({
            error: "Not a valid 'id'."
        });
        return;
    }

    const { name, amount, price, catagori } = req.body

    // Validering
    if (name !== undefined && typeof name !== "string") {
        res.status(400).json({
            error: "'name' must be a string."
        });
        return;
    }

    if (catagori !== undefined && typeof catagori !== "string") {
        res.status(400).json({
            error: "'catagori' must be a string."
        });
        return;
    }

    if (price !== undefined && typeof price !== "number") {
        res.status(400).json({
            error: "'price' must be numbers."
        });
        return;
    }

    if (amount !== undefined && typeof amount !== "number") {
        res.status(400).json({
            error: "'amount' must be number."
        });
        return;
    }
    //Update products


    res.json();

});

// Delete specific product with id
router.delete('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    // Validering ID
    if (isNaN(id)) {
        res.status(400).json({
            error: "'id' must be a number."
        });
        return;
    }

    //const index = products.findIndex(find => find.id === id);



    //let deletedProduct = splice(index, 1);

    res.json();

});


module.exports = router;