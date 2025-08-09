const cartController = {};
const Cart = require("../models/Cart");

cartController.addItemToCart = async (req, res) => {
    try {
        const { userId } = req;
        const { productId, color, qty } = req.body;
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            const newCart = new Cart({ userId, items: [{ productId, color, qty }] });
            await newCart.save();
            return res.status(200).json({ status: "success", data: newCart, cartItemQty: newCart.items.length });
        }
        const existingItem = cart.items.find((item) => item.productId.equals(productId) && item.color === color);
        if (existingItem) {
            throw new Error("이미 장바구니에 있는 상품입니다.");
        } else {
            cart.items = [...cart.items, { productId, color, qty }];
            await cart.save();
        }
        res.status(200).json({ status: "success", data: cart, cartItemQty: cart.items.length });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

cartController.getCartItemQty = async (req, res) => {
    try {
        const { userId } = req;
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            throw new Error("장바구니가 비어있습니다.");
        }
        res.status(200).json({ status: "success", data: cart.items.length });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

cartController.getCart = async (req, res) => {
    try {
        const { userId } = req;
        const cart = await Cart.findOne({ userId }).populate({
            path: "items",
            populate: {
                path: "productId",
                model: "Product",
            },
        });
        if (!cart) {
            return res.status(200).json({ status: "success", data: [] });
        }
        res.status(200).json({ status: "success", data: cart.items });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

cartController.removeItemFromCart = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req;
        const cart = await Cart.findOne({ userId }).populate({
            path: "items",
            populate: {
                path: "productId",
                model: "Product",
            },
        });
        if (!cart) {
            throw new Error("장바구니가 비어있습니다.");
        }
        cart.items = cart.items.filter((item) => !item._id.equals(id));
        await cart.save();
        res.status(200).json({ status: "success", data: cart.items, cartItemQty: cart.items.length });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

cartController.updateItemInCart = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req;
        const { qty } = req.body;
        const cart = await Cart.findOne({ userId }).populate({
            path: "items",
            populate: {
                path: "productId",
                model: "Product",
            },
        });
        if (!cart) {
            throw new Error("장바구니가 비어있습니다.");
        }
        const existingItem = cart.items.find((item) => item._id.equals(id));
        if (!existingItem) {
            throw new Error("장바구니에 해당 상품이 없습니다.");
        }
        existingItem.qty = qty;
        await cart.save();
        res.status(200).json({ status: "success", data: cart.items });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

module.exports = cartController;
