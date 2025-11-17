import express from 'express';
import * as productRepository from '../repositories/productRepository.mjs';
import { validateId, validateProduct } from '../middleware/validation.mjs';


const router = express.Router();

router.use(express.json())

// Create product
router.post('/products', validateProduct, async (req, res) => {
    const { name, amount, price, category, supplier_id } = req.body;
    try {
        const product = await productRepository.postProduct(name, amount, price, category, supplier_id);
        res.status(201).json({ message: "Product created.", product });
    } catch (error) {
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
router.get('/products', async (req, res) => {
    try {
        const products = await productRepository.getAllProducts();
        res.status(200).json(products)
    } catch (error) {
        console.error("DatabaseError:", error);
        res.status(500).json({ error: "Server Fault" });
    }
});

// Get specific product with id
router.get('/products/:id', validateId, async (req, res) => {
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
    const { name, amount, price, category, supplier_id } = req.body;
    const id = parseInt(req.params.id);
    //Update products
    try {
        const product = await productRepository.updateProduct(name, price, amount, category, supplier_id, id);
        res.status(200).json({
            message: "Product update successfully",
            product
        });

    } catch (error) {
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


export const productRoutes = router;