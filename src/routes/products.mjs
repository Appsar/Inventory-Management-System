import express from 'express';
import { pool } from '../config/pool.mjs';
import * as productRepository from '../repositories/productRepository.mjs'

const router = express.Router();

router.use(express.json())

// Create product
router.post('/products', async (req, res) => {
    const { name, amount, price, category } = req.body;

    //Validate input for POST product
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
        const products = await productRepository.getAllProducts();
        res.json(products)
    } catch (error) {
        console.error("DatabaseError:", error);
        res.status(500).json({ error: "Server Fault" });
    }
});

// Get specific product with id
router.get('/products/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    //Validate params id
    if (isNaN(id)) {
        res.status(400).json({
            error: "'id' must be a number."
        });
        return;
    }

    try {
        const query = "SELECT * FROM products WHERE id = $1";
        const values = [id];

        const result = await pool.query(query, values);

        //Validate if product id exits
        if (result.rows.length === 0) {
            res.status(404).json({
                error: "Product with that id cant be found."
            });
            return;
        }

        res.status(200).json(result.rows);

    } catch (error) {
        console.error("Database Fault:", error);
        res.status(500).json({
            error: "Server Fault."
        });
    };
});

// Update specific product with id
router.put('/products/:id', async (req, res) => {
    // Get ID for product
    const id = parseInt(req.params.id);
    // Validering ID
    if (isNaN(id)) {
        res.status(400).json({
            error: "'id' must be a number."
        });
        return;
    }

    //Update products
    try {
        const { name, price, amount, category } = req.body

        // Validate body data
        if (!name || !amount || !price || !category) {
            res.status(400).json({
                error: "Must include 'name', 'price', 'amount' and 'category'."
            });
            return;
        }
        if (name !== undefined && typeof name !== "string") {
            res.status(400).json({
                error: "'name' must be a string."
            });
            return;
        }

        if (category !== undefined && typeof category !== "string") {
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

        //Update the chosen id with new data
        const query = "UPDATE products SET name = $1, amount = $2, price = $3, category = $4 WHERE id = $5 RETURNING *";
        const values = [name, amount, price, category, id]
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            res.status(404).json({
                error: "Product no found."
            })
            return;
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error("Database fault", error);
        res.status(500).json({
            error: "Server fault."
        });
    }
});

// Delete specific product with id
router.delete('/products/:id', async (req, res) => {
    //Get ID for product
    const id = parseInt(req.params.id);
    // Validate ID
    if (isNaN(id)) {
        res.status(400).json({
            error: "'id' must be a number."
        });
        return;
    }

    try {
        const query = "DELETE FROM products WHERE id = $1 RETURNING *"
        const values = [id];
        const result = await pool.query(query, values)

        //Validate if product exists
        if (result.rows.length === 0) {
            res.status(404).json({
                error: "Product not found."
            })
            return;
        }

        res.status(200).json({
            productDeleted: result.rows[0]
        });

    } catch (error) {
        console.error("Database fault", error);
        res.status(500).json({
            error: "Server fault."
        });
    }

});


export const productRoutes = router;