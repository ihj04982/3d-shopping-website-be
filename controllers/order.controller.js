const orderController = {};
const Order = require("../models/Order");
const productController = require("./product.controller");
const { randomStringGenerator } = require("../utils/randomStringGenerator");

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

module.exports = orderController;
