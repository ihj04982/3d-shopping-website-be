const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        name: {
            type: String,
            required: true,
        },
        level: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    {
        timestamps: true,
    }
);

userSchema.methods.toJSON = function () {
    const obj = this._doc;
    delete obj.password;
    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;
    return obj;
};

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
    return token;
};

module.exports = mongoose.model("User", userSchema);
