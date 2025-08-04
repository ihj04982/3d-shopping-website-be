const User = require("../models/User");
const userController = {};
const bcrypt = require("bcryptjs");

const saltRounds = 10;

userController.createUser = async (req, res) => {
    try {
        const { name, email, password, level } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            throw new Error("이미 존재하는 이메일입니다.");
        }
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        const newUser = new User({
            name,
            email,
            password: hash,
            level: level ? level : "user",
        });
        await newUser.save();
        res.status(200).json({ status: "success", message: "유저가 성공적으로 생성되었습니다." });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

userController.getUser = async (req, res) => {
    try {
        const { userId } = req;
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("유저를 찾을 수 없습니다.");
        }
        res.status(200).json({ status: "success", user });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
};

module.exports = userController;
