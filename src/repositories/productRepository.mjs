import { pool } from '../config/pool.mjs';


export async function postProduct(name, price, amount, category) {
    const query = "INSERT INTO products (name,price,amount,category) VALUES ($1,$2,$3,$4) RETURNING *";
    const values = [name, price, amount, category];

    const result = await pool.query(query, values);

    return result.rows[0];

}

export async function getAllProducts() {
    const result = await pool.query("SELECT * FROM products");
    return result.rows;
}

export async function getIdProduct(id) {
    const query = "SELECT * FROM products WHERE id = $1";
    const values = [id]

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
        throw new Error("Product not found");
    }

    return result.rows[0];

}

export async function updateProduct(name, amount, price, category, id) {
    const query = "UPDATE products SET name = $1, amount = $2, price = $3, category = $4 WHERE ID = $5 RETURNING *";
    const values = [name, amount, price, category, id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
        throw new Error("Product not found");
    }

    return result.rows[0];

}

export async function deleteProduct(id) {
    const query = "DELETE FROM products WHERE id = $1 RETURNING *"
    const values = [id];
    const result = await pool.query(query, values)

    if (result.rows.length === 0) {
        throw new Error("Product not found");
    }

    return result.rows[0];
}
