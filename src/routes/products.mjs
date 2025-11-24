//Import
import express from 'express';
import * as productRepository from '../repositories/productRepository.mjs';
import { validateId, validateProduct } from '../middleware/validation.mjs';
import { paginationMiddleware } from '../middleware/pagination.mjs';
import { pool } from '../config/pool.mjs';


const router = express.Router();

router.use(express.json())

// Create product
router.post('/products', validateProduct, async (req, res) => {
    //Needed input data from body
    const { name, amount, price, category, supplier_id } = req.body;
    try {
        const product = await productRepository.postProduct(name, amount, price, category, supplier_id);
        res.status(201).json({ message: "Product created.", product });
    } catch (error) { //Error handeling for database
        if (error.code === '23503') {
            return res.status(409).json({
                error: "That supplier ID does not exist."
            })
        }
        console.error("Database Fault:", error);
        res.status(500).json({
            error: "Could not create product."
        });
    };
});

// Get ALL products
router.get('/products', paginationMiddleware, async (req, res) => {
    const { page, limit, offset } = req.pagination;
    try {
        //Count amount of products
        const countAmount = await pool.query('SELECT COUNT(*) FROM products');
        const totalCount = parseInt(countAmount.rows[0].count)

        //Calculate how many pages with total amount of products
        const totalPages = Math.ceil(totalCount / limit)

        const products = await productRepository.getAllProducts(limit, offset);
        //Respond with information about pagination
        res.status(200).json({
            data: products,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                limit
            }
        })
    } catch (error) {
        console.error("DatabaseError:", error);
        res.status(500).json({ error: "Server Fault" });
    }
});

// Search for prodcuts
router.get('/products/search', paginationMiddleware, async (req, res) => {
    const search = req.query.name
    const { page, limit, offset } = req.pagination;
    try {
        //Count amount of products
        const countAmount = await pool.query('SELECT COUNT(*) FROM products');
        const totalCount = parseInt(countAmount.rows[0].count)

        //Count amount found from search
        const currentAmount = await pool.query("SELECT COUNT(*) FROM products WHERE products.name LIKE $1", ["%" + search + "%"])
        const currentAmountFinal = parseInt(currentAmount.rows[0].count);

        //Calculate how many pages with total amount of products
        const totalPages = Math.ceil(currentAmountFinal / limit)

        const products = await productRepository.searchName(search, limit, offset);

        //Respond with information about pagination
        res.status(200).json({
            data: products,
            pagination: {
                currentPage: page,
                totalPages,
                searchAmountFound: currentAmountFinal,
                totalProductsCount: totalCount,
                limit
            }
        })
    } catch (error) {
        if (error.message === "Product not found") {
            return res.status(404).json({
                error: `No products found with the search '${search}' `
            })
        }
        console.error("DatabaseError", error);
        res.status(500).json({
            error: "Server Fault"
        })
    }
});

// Get specific product with id
router.get('/products/:id', validateId, async (req, res) => {
    //Id requierd for finding specific product
    const id = parseInt(req.params.id);
    try {
        const product = await productRepository.getIdProduct(id);
        res.status(200).json(product);

    } catch (error) {
        if (error.message === "Product not found") {
            return res.status(404).json({
                error: "Product not found"
            })
        }
        console.error("Database Fault:", error);
        res.status(500).json({
            error: "Server Fault."
        });
    };
});

// Update specific product with id
router.put('/products/:id', validateProduct, validateId, async (req, res) => {
    //Reqiuerd input data to update product
    const { name, amount, price, category, supplier_id } = req.body;
    const id = parseInt(req.params.id);
    //Update products
    try {
        const product = await productRepository.updateProduct(name, price, amount, category, supplier_id, id);
        res.status(200).json({
            message: "Product update successfully",
            product
        });

    } catch (error) { //Database error handling
        if (error.message === "Product not found") {
            return res.status(404).json({
                error: "Product not found."
            })
        }
        if (error.code === '23503') {
            return res.status(409).json({
                error: "That supplier ID does not exist."
            })
        }
        console.error("Database fault", error);
        res.status(500).json({
            error: "Server fault."
        });
    }
});

// Delete specific product with id
router.delete('/products/:id', validateId, async (req, res) => {
    //Reqiured input data to find id
    const id = parseInt(req.params.id);
    try {
        //Validate if product exists
        const product = await productRepository.deleteProduct(id);
        res.status(200).json({
            message: "Product deleted successfully",
            product
        });

    } catch (error) {
        if (error.message === "Product not found") {
            return res.status(404).json({
                error: "Product not found."
            })
        }
        console.error("Database fault", error);
        res.status(500).json({
            error: "Server fault."
        });
    }

});

//Export
export const productRoutes = router;