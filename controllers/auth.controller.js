const authController = {};
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

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

authController.loginWithGoogle = async (req, res) => {
    try {
        const { token } = req.body;
        const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        });
        const { email, name } = ticket.getPayload();
        let user = await User.findOne({ email });
        if (!user) {
            const randomPassword = "" + Math.floor(Math.random() * 100000000);
            const salt = bcrypt.genSaltSync(10);
            const newPassword = bcrypt.hashSync(randomPassword, salt);
            user = new User({ email, name, password: newPassword });
            await user.save();
        }
        const sessionToken = await user.generateAuthToken();
        return res.status(200).json({ status: "success", user, token: sessionToken });
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

        jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
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

authController.checkAdminPermission = async (req, res, next) => {
    try {
        const { userId } = req;
        const user = await User.findById(userId);
        if (user.level !== "admin") {
            throw new Error("권한이 없습니다.");
        }
        next();
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

module.exports = authController;
