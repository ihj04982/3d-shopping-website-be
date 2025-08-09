const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const authController = require("../controllers/auth.controller");

router.post("/", authController.authenticate, cartController.addItemToCart);
router.get("/", authController.authenticate, cartController.getCart);
router.get("/qty", authController.authenticate, cartController.getCartItemQty);
router.delete("/:id", authController.authenticate, cartController.removeItemFromCart);
router.put("/:id", authController.authenticate, cartController.updateItemInCart);

module.exports = router;
