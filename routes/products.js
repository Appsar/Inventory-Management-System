const express = require('express');
const router = express.Router();

router.use(express.json())

let products = [
    { id: 1, name: "tractor", amount: 10, price: 5000, catagori: "vehicle" }
]
let nextID = 1;

// Create product
router.post('/products', (req, res) => {
    const { name, amount, price, catagori } = req.body;

    if (!name || !amount || !price || !catagori) {
        res.status(400).json({
            error: "Must include 'name', 'amount', 'price' and 'catagori'."
        });
        return;
    }

    if (typeof name !== "string" || typeof catagori !== "string") {
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


    let newProduct = {
        id: nextID++,
        name,
        amount,
        price,
        catagori
    };

    products.push(newProduct);

    res.status(201).json(newProduct);
});

// Get ALL products
router.get('/products', (req, res) => {
    res.json(products);
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
    const index = products.find(find => find.id === id);

    if (index === undefined) {
        res.status(400).json({
            error: "Not a valid 'id'."
        });
        return;
    }

    res.json(index);
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

    const index = products.findIndex(find => find.id === id);

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
    products[index] = {
        ...users[index],
        ...req.body,
        id,
        updateAt: new Date()
    }

    res.json(products[index]);

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

    const index = products.findIndex(find => find.id === id);

    if (index === -1) {
        res.status(400).json({
            error: "Not a valid 'id'."
        });
        return;
    }

    let deletedProduct = products.splice(index, 1);

    res.json(deletedProduct);

});


module.exports = router;