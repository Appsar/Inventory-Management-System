import { pool } from '../config/pool.mjs';

//Get ALL suppliers
export async function getAllSuppliers() {
    const result = await pool.query("SELECT * FROM suppliers");
    return result.rows;
}

//Get SPECIFIC supplier with AMOUNT of products
export async function getSupplierAmount(id) {
    const query = "SELECT suppliers.*, COUNT(products.id) AS product_count FROM suppliers LEFT JOIN products ON suppliers.id = products.supplier_id WHERE suppliers.id = $1 GROUP BY suppliers.id"
    const values = [id];

    const result = await pool.query(query, values)

    if (result.rows.length === 0) {
        throw new Error("Supplier not found");
    }

    return result.rows[0];

}

//Get ALL products from SPECIFIC supplier
export async function getAllProductsWithSupplier(id) {
    const query = "SELECT products.id, products.name AS product_name, products.amount, products.price, products.category, suppliers.name AS supplier_name, suppliers.id AS supplier_id FROM products INNER JOIN suppliers ON suppliers.id = products.supplier_id WHERE suppliers.id = $1;"
    const values = [id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
        throw new Error("Supplier not found");
    }

    return result.rows;

}

//Create a supplier
export async function createSupplier(name, contactperson, email, phonenumber, country) {
    const query = "INSERT INTO suppliers (name,contactperson,email,phonenumber,country) VALUES ($1, $2, $3, $4, $5) RETURNING *"
    const values = [name, contactperson, email, phonenumber, country];

    const result = await pool.query(query, values);

    return result.rows[0];

}

//Update a supplier with all data
export async function updateSupplier(name, contactperson, email, phonenumber, country, id) {
    const query = "UPDATE suppliers SET name = $1, contactperson = $2, email = $3, phonenumber = $4, country = $5 WHERE ID = $6 RETURNING *"
    const values = [name, contactperson, email, phonenumber, country, id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
        throw new Error("Supplier not found");
    }

    return result.rows[0];
}

//Delete supplier and make corresponding products become status NULL in supplier_name and supplier_id
export async function deleteSupplier(id) {
    const query = "DELETE FROM suppliers WHERE id = $1 RETURNING *";
    const values = [id];

    const result = await pool.query(query, values)

    if (result.rows.length === 0) {
        throw new Error("Supplier not found");
    }

    return result.rows[0];
}