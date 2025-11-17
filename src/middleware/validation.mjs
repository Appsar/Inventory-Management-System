//Validate product with the reqiured input data from body
export const validateProduct = (req, res, next) => {
    const { name, amount, price, category, supplier_id } = req.body;

    if (!name || !amount || !price || !category || !supplier_id) {
        res.status(400).json({
            error: "Must include 'name', 'price', 'amount', 'category' and 'supplier_id'."
        });
        return;
    }
    if (name !== undefined && typeof name !== "string") {
        res.status(400).json({
            error: "'name' must be a string."
        });
        return;
    }

    if (category !== undefined && typeof category !== "string") {
        res.status(400).json({
            error: "'catagori' must be a string."
        });
        return;
    }

    if (price !== undefined && typeof price !== "number") {
        res.status(400).json({
            error: "'price' must be a number."
        });
        return;
    }

    if (amount !== undefined && typeof amount !== "number") {
        res.status(400).json({
            error: "'amount' must be a number."
        });
        return;
    }

    if (supplier_id !== undefined && typeof supplier_id !== "number") {
        res.status(400).json({
            error: "'supplier_id' must be a number"
        })
        return;
    }

    next();
}

//Validate if id is a number
export const validateId = (req, res, next) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({
            error: "'id' must be a number."
        });
        return;
    }
    next();
}

//Validate supplier with the reqiured input data from body
export const validateSupplier = (req, res, next) => {
    const { name, contactperson, email, phonenumber, country } = req.body

    if (!name || !contactperson || !email || !phonenumber || !country) {
        res.status(400).json({
            error: "Must include 'name', 'contactperson', 'email', 'phonenumber' and 'country'."
        });
        return;
    }

    if (name !== undefined && typeof name !== "string") {
        res.status(400).json({
            error: "'name' must be a string."
        });
        return;
    }

    if (contactperson !== undefined && typeof contactperson !== "string") {
        res.status(400).json({
            error: "'contactperson' must be a string."
        });
        return;
    }

    if (email !== undefined && typeof email !== "string") {
        res.status(400).json({
            error: "'email' must be a string."
        });
        return;
    }

    if (phonenumber !== undefined && typeof phonenumber !== "string") {
        res.status(400).json({
            error: "'phonenumber' must be numbers."
        });
        return;
    }

    if (country !== undefined && typeof country !== "string") {
        res.status(400).json({
            error: "'country' must be number."
        });
        return;
    }

    next();
}