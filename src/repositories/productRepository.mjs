import { pool } from '../config/pool.mjs';

//Function to post product
export async function postProduct(name, price, amount, category, supplier_id) {
    const query = "INSERT INTO products (name,price,amount,category, supplier_id) VALUES ($1,$2,$3,$4,$5) RETURNING *";
    const values = [name, price, amount, category, supplier_id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
        throw new Error("Not a valid supplier_id");
    }

    return result.rows[0];
}

//Function to get ALL products
export async function getAllProducts() {
    const result = await pool.query("SELECT products.id, products.name AS product_name, products.amount, products.price, products.category, products.supplier_id, suppliers.name AS supplier_name FROM products LEFT JOIN suppliers ON suppliers.id = products.supplier_id");
    return result.rows;
}


//Function to search for specific product
export async function searchName(search) {
    const query = "SELECT * FROM products WHERE products.name LIKE $1"
    const values = ["%" + search + "%"];

    const result = await pool.query(query, values)

    if (result.rows.length === 0) {
        throw new Error("Product not found");
    }

    return result.rows;
}

//Function to get SPECIFIC product with supplier name and id
export async function getIdProduct(id) {
    const query = "SELECT products.*, suppliers.name AS supplier_name FROM products LEFT JOIN suppliers ON suppliers.id = products.supplier_id WHERE products.id = $1";
    const values = [id]

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
        throw new Error("Product not found");
    }

    return result.rows[0];
}

//Update SPECIFIC product with ALL data
export async function updateProduct(name, amount, price, category, supplier_id, id) {
    const query = "UPDATE products SET name = $1, amount = $2, price = $3, category = $4, supplier_id = $5 WHERE ID = $6 RETURNING *";
    const values = [name, amount, price, category, supplier_id, id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
        throw new Error("Product not found");
    }

    return result.rows[0];
}

//Delete SPECIFIC product
export async function deleteProduct(id) {
    const query = "DELETE FROM products WHERE id = $1 RETURNING *"
    const values = [id];

    const result = await pool.query(query, values)

    if (result.rows.length === 0) {
        throw new Error("Product not found");
    }

    return result.rows[0];
}
