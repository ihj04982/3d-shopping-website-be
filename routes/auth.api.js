const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/login", authController.loginWithEmail);
router.post("/login/google", authController.loginWithGoogle);

module.exports = router;
