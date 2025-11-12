const express = require('express');
const router = express.Router();

router.use(express.json())

// Create product
router.post('/products', (req, res) => {

});

// Get ALL products
router.get('/products', (req, res) => {

});

// Get specific product with id
router.get('/products/:id', (req, res) => {

});

// Update specific product with id
router.put('/products/:id', (req, res) => {

});

// Delete specific product with id
router.delete('/products/:id', (req, res) => {

});


module.exports = router;