const productController = {};

const Product = require("../models/Product");

productController.createProduct = async (req, res) => {
    try {
        const { sku, name, image, category, description, price, stock, status } = req.body;
        const product = await Product.create({
            sku,
            name,
            image,
            category,
            description,
            price,
            stock,
            status,
        });
        res.status(200).json({ status: "success", product });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

module.exports = productController;
