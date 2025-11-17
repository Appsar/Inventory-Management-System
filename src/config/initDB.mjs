import { pool } from '../config/pool.mjs';

//Create new Database Tables if they dont exist
async function createDBTables() {

    try {
        await pool.query(`
    CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    contactPerson TEXT NOT NULL,
    email TEXT NOT NULL,
    phonenumber TEXT NOT NULL,
    country TEXT NOT NULL
);`
        );

        await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    amount INT,
    price INT,
    category TEXT NOT NULL,
    supplier_id INT REFERENCES suppliers(id)
    ON DELETE SET NULL
);`
        );
    } catch (error) {
        console.error("Error creating tables:", error)
        throw error;
    }
}

export default createDBTables;