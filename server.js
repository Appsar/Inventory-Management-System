const express = require('express');
const app = express();

const path = require('path');

const productRoutes = require('./routes/products');

app.use('/api', productRoutes);

app.use(express.json());


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});