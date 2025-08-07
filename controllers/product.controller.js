const productController = {};

const Product = require("../models/Product");
const PAGE_SIZE = 5;

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
        const { page, name } = req.query;
        const condition = name ? { name: { $regex: name, $options: "i" } } : {};
        let query = Product.find(condition);
        let response = { status: "success" };
        if (page) {
            query = query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
            const totalItems = await Product.countDocuments(condition);
            const totalPages = Math.ceil(totalItems / PAGE_SIZE);
            response.totalPages = totalPages;
        }
        const products = await query.exec();
        response.data = products;
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

module.exports = productController;
