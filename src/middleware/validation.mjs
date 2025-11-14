
export const validateProduct = (req, res, next) => {
    const { name, amount, price, category } = req.body;

    if (!name || !amount || !price || !category) {
        res.status(400).json({
            error: "Must include 'name', 'price', 'amount' and 'category'."
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
            error: "'price' must be numbers."
        });
        return;
    }

    if (amount !== undefined && typeof amount !== "number") {
        res.status(400).json({
            error: "'amount' must be number."
        });
        return;
    }

    next();
}

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