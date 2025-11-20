import { pool } from '../config/pool.mjs';

//Create new Database Tables if they dont exist
export async function createDBTables() {

    try {
        await pool.query(`
    CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    contactPerson TEXT NOT NULL,
    email TEXT NOT NULL,
    phonenumber TEXT NOT NULL,
    country TEXT NOT NULL
    )
    `);

        await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    amount INT,
    price INT,
    category TEXT NOT NULL,
    supplier_id INT REFERENCES suppliers(id)
    ON DELETE SET NULL,
    UNIQUE(name, supplier_id)
    )
    `);

        console.log("Tables created Successfully.")
    } catch (error) {
        console.error("Error creating tables:", error)
        throw error;
    }
}

export async function insertTestData() {

    try {
        await pool.query(`
            INSERT INTO suppliers (name, contactPerson, email, phonenumber, country) VALUES
            ('TechSupply Co', 'John Smith', 'john@techsupply.com', '+1-555-0101', 'USA'),
            ('Global Electronics', 'Maria Garcia', 'maria@globalelec.com', '+34-912-345-678', 'Spain'),
            ('Nordic Components', 'Lars Andersson', 'lars@nordiccomp.se', '+46-8-123-4567', 'Sweden'),
            ('Asia Manufacturing', 'Chen Wei', 'chen@asiamfg.cn', '+86-10-8888-9999', 'China'),
            ('Euro Parts Ltd', 'Sophie Dubois', 'sophie@europarts.fr', '+33-1-42-86-82-00', 'France')
            ON CONFLICT (name) DO NOTHING
        `);

        await pool.query(`
            INSERT INTO products (name, amount, price, category, supplier_id) VALUES
            ('Laptop Pro 15', 50, 1299, 'Electronics', 1),
            ('Wireless Mouse', 200, 25, 'Accessories', 1),
            ('USB-C Cable', 500, 12, 'Cables', 2),
            ('External SSD 1TB', 75, 149, 'Storage', 2),
            ('Mechanical Keyboard', 120, 89, 'Accessories', 3),
            ('Monitor 27inch', 40, 399, 'Electronics', 3),
            ('Webcam HD', 150, 79, 'Electronics', 4),
            ('Headphones Premium', 80, 199, 'Audio', 4),
            ('Phone Charger', 300, 19, 'Accessories', 5),
            ('HDMI Cable 2m', 250, 15, 'Cables', 5)
            ON CONFLICT (name, supplier_id) DO NOTHING
        `);

        console.log("Table test data inserted successfully.");
    } catch (error) {
        console.error("Error adding 'testdate' to tables.")
        throw error;

    }

}
