const authController = {};
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtSecretKey = process.env.JWT_SECRET_KEY;

authController.loginWithEmail = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }, "-createdAt, -updatedAt, -__v");
        if (user) {
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (isPasswordValid) {
                const token = await user.generateAuthToken();
                return res
                    .status(200)
                    .json({ status: "success", message: "성공적으로 로그인 되었습니다.", user, token });
            } else {
                throw new Error("비밀번호가 일치하지 않습니다.");
            }
        } else {
            throw new Error("존재하지 않는 이메일입니다.");
        }
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

authController.authenticate = (req, res, next) => {
    try {
        const tokenString = req.headers.authorization;
        if (!tokenString) {
            throw new Error("토큰이 없습니다.");
        }
        const token = tokenString.replace("Bearer ", "");

        jwt.verify(token, jwtSecretKey, (error, payload) => {
            if (error) {
                throw new Error("토큰이 유효하지 않습니다.");
            }
            req.userId = payload._id;
            next();
        });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

module.exports = authController;
