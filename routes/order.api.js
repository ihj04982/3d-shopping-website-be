const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const orderController = require("../controllers/order.controller");

router.post("/", authController.authenticate, orderController.createOrder);
router.get("/", authController.authenticate, authController.checkAdminPermission, orderController.getOrders);
router.get("/me", authController.authenticate, orderController.getUserOrders);
router.get("/:id", orderController.getOrderById);
router.put("/:id", authController.authenticate, authController.checkAdminPermission, orderController.updateOrderStatus);

module.exports = router;
