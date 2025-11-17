import express from 'express';
import * as suppliersRepository from '../repositories/suppliersRepository.mjs';
import { validateSupplier, validateId } from '../middleware/validation.mjs';
const router = express.Router();

router.use(express.json());

// Get all suppliers
router.get('/suppliers', async (req, res) => {
    try {
        const supplier = await suppliersRepository.getAllSuppliers()
        res.json(supplier)

    } catch (error) {
        console.error("Database error", error);
        res.status(500).json({
            error: "Server fault."
        });
        return;
    }

})

//Get specific supplier also return total amount of products for the supplier, but not the product itself
router.get('/suppliers/:id', validateId, async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const supplier = await suppliersRepository.getSupplierAmount(id);
        res.json(supplier);

    } catch (error) {
        if (error.message === "Supplier not found") {
            return res.status(404).json({
                error: "Supplier not found."
            })
        }
        console.error("Database error", error);
        res.status(500).json({
            error: "Server fault."
        });
        return;
    }

})

//Get all products from specific supplier
router.get('/suppliers/:id/products', validateId, async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const supplier = await suppliersRepository.getAllProductsWithSupplier(id);
        res.json(supplier);

    } catch (error) {
        if (error.message === "Supplier not found") {
            return res.status(404).json({
                error: "Supplier with that 'id' not found."
            })
        }
        console.error("Database error", error);
        res.status(500).json({
            error: "Server fault."
        });
        return;
    }

})

//Post supplier
router.post('/suppliers', validateSupplier, async (req, res) => {
    const { name, contactperson, email, phonenumber, country } = req.body

    try {
        const supplier = await suppliersRepository.createSupplier(name, contactperson, email, phonenumber, country);
        res.status(201).json(supplier);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({
                error: "A supplier with this name already exists."
            })
        }
        console.error("Database error", error);
        res.status(500).json({
            error: "Server fault."
        });
        return;
    }


})

//Update supplier
router.put('/suppliers/:id', validateSupplier, validateId, async (req, res) => {
    const { name, contactperson, email, phonenumber, country } = req.body
    const id = parseInt(req.params.id);

    try {
        const supplier = await suppliersRepository.updateSupplier(name, contactperson, email, phonenumber, country, id);
        res.status(200).json({ message: "Supplier update successfully", supplier })
    } catch (error) {
        if (error.message === "Supplier not found") {
            return res.status(404).json({
                error: "Supplier with that 'id' not found."
            })
        }
        if (error.code === '23505') {
            return res.status(409).json({
                error: "A supplier with this name already exists."
            })
        }
        console.error("Database error", error);
        res.status(500).json({
            error: "Server fault."
        });
        return;
    }
})

//Delete supplier
router.delete('/suppliers/:id', validateId, async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const supplier = await suppliersRepository.deleteSupplier(id);
        res.status(200).json({ message: "Supplier deleted successfully", supplier });

    } catch (error) {
        if (error.message === "Supplier not found") {
            return res.status(404).json({
                error: "Supplier with that 'id' not found."
            })
        }
        console.error("Database error", error);
        res.status(500).json({
            error: "Server fault."
        });
        return;
    }

})

export const suppliersRoutes = router;