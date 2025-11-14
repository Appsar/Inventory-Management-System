import { pool } from '../config/pool.mjs';

export async function getAllProducts() {
    const result = await pool.query("SELECT * FROM products");
    return result.rows;
}