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
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            const value = error.keyValue[field];
            return res.status(409).json({
                status: "error",
                message: `${field === "sku" ? "SKU" : field} "${value}"는 이미 존재합니다.`,
            });
        }

        res.status(400).json({ status: "error", message: error.message });
    }
};

productController.getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ status: "success", data: products });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

module.exports = productController;
