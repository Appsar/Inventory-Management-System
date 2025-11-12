const express = require('express');
const app = express();

const path = require('path');

const productRoutes = require('./routes/products');
const suppliersRoutes = require('./routes/suppliers');

app.use('/api', productRoutes);
app.use('/api', suppliersRoutes);

app.use(express.json());


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});