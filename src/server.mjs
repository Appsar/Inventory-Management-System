import express from 'express';
const app = express();

import dotenv from 'dotenv';
dotenv.config();

import { productRoutes } from './routes/products.mjs';
import { suppliersRoutes } from './routes/suppliers.mjs';

app.use('/api', productRoutes);
app.use('/api', suppliersRoutes);

app.use(express.json());

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});