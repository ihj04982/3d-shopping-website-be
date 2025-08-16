const productController = {};

const Product = require("../models/Product");
const PAGE_SIZE = 4;

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
        const { page, name, category } = req.query;
        const condition = {};

        if (name) {
            condition.name = { $regex: name, $options: "i" };
        }

        if (category) {
            condition.category = { $in: [category] };
        }

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

productController.getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error("상품을 찾을 수 없습니다.");
        }
        res.status(200).json({ status: "success", product });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

productController.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, image, category, description, price, stock, status } = req.body;
        const product = await Product.findByIdAndUpdate(
            { _id: productId },
            { name, image, category, description, price, stock, status },
            { new: true }
        );
        if (!product) {
            throw new Error("상품을 찾을 수 없습니다.");
        }
        res.status(200).json({ status: "success", product });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

productController.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            throw new Error("상품을 찾을 수 없습니다.");
        }
        res.status(200).json({ status: "success", product });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

productController.checkStock = async (item) => {
    const product = await Product.findById(item.productId);

    if (product.stock[item.color] < item.qty) {
        return { isVerified: false, message: `${product.name} ${item.color} 색상의 재고가 부족합니다.` };
    }
    const newStock = { ...product.stock };
    newStock[item.color] -= item.qty;
    product.stock = newStock;
    await product.save();

    return { isVerified: true };
};

productController.checkItemListStock = async (itemList) => {
    const insufficientStock = [];
    const productsToUpdate = [];

    for (const item of itemList) {
        const product = await Product.findById(item.productId);

        if (product.stock[item.color] < item.qty) {
            insufficientStock.push({
                item,
                message: `${product.name} ${item.color} 색상의 재고가 부족합니다.`,
            });
        } else {
            productsToUpdate.push({ product, item });
        }
    }

    if (insufficientStock.length > 0) {
        return insufficientStock;
    }

    for (const { product, item } of productsToUpdate) {
        const newStock = { ...product.stock };
        newStock[item.color] -= item.qty;
        product.stock = newStock;
        await product.save();
    }

    return insufficientStock;
};
module.exports = productController;
