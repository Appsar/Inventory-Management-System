import express from 'express';
const app = express();

import { productRoutes } from './routes/products.mjs';
import { suppliersRoutes } from './routes/suppliers.mjs';

app.use('/api', productRoutes);
app.use('/api', suppliersRoutes);

app.use(express.json());

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});