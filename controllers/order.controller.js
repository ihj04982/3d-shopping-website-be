const orderController = {};
const Order = require("../models/Order");
const productController = require("./product.controller");
const { randomStringGenerator } = require("../utils/randomStringGenerator");

const PAGE_SIZE = 6;

orderController.createOrder = async (req, res) => {
    try {
        const { userId } = req;
        const { shipTo, contact, totalPrice, orderList } = req.body;
        const insufficientStock = await productController.checkItemListStock(orderList);

        if (insufficientStock.length > 0) {
            const errorMessage = insufficientStock.reduce((total, item) => (total += item.message), "");
            throw new Error(errorMessage);
        }

        const newOrder = new Order({
            userId,
            shipTo,
            contact,
            totalPrice,
            items: orderList,
            orderNum: randomStringGenerator(),
        });

        await newOrder.save();
        res.status(200).json({ status: "success", message: "주문이 완료되었습니다.", orderNum: newOrder.orderNum });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

orderController.getUserOrders = async (req, res) => {
    try {
        const { userId } = req;

        const orders = await Order.find({ userId })
            .populate({
                path: "items.productId",
                select: "name image price description category",
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: "success",
            message: "주문 목록을 성공적으로 조회했습니다.",
            data: orders,
        });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

orderController.getOrders = async (req, res) => {
    try {
        const { page, orderNum } = req.query;
        const condition = orderNum ? { orderNum: { $regex: orderNum, $options: "i" } } : {};
        let query = Order.find(condition)
            .populate({
                path: "userId",
                select: "name email",
            })
            .populate({
                path: "items.productId",
                select: "name image price description category",
            });

        let response = { status: "success" };

        if (page) {
            query = query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
            const totalItems = await Order.countDocuments(condition);
            const totalPages = Math.ceil(totalItems / PAGE_SIZE);
            response.totalPages = totalPages;
        }

        const orders = await query.sort({ createdAt: -1 }).exec();
        response.data = orders;

        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

orderController.getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId)
            .populate({
                path: "userId",
                select: "name email",
            })
            .populate({
                path: "items.productId",
                select: "name image price description category sku",
            });

        if (!order) {
            throw new Error("주문을 찾을 수 없습니다.");
        }

        res.status(200).json({ status: "success", order });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

orderController.updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true })
            .populate({
                path: "userId",
                select: "name email",
            })
            .populate({
                path: "items.productId",
                select: "name image price description category",
            });

        if (!order) {
            throw new Error("주문을 찾을 수 없습니다.");
        }

        res.status(200).json({ status: "success", order });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

module.exports = orderController;
