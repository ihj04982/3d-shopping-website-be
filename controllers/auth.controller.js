const authController = {};
const User = require("../models/User");
const bcrypt = require("bcryptjs");

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

module.exports = authController;
