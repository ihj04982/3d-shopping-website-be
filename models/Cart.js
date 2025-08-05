const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema(
    {
        userId: { type: mongoose.ObjectId, ref: "User" },
        items: [
            {
                productId: {
                    type: mongoose.ObjectId,
                    ref: "Product",
                },
                color: {
                    type: String,
                    required: true,
                },
                qty: {
                    type: Number,
                    required: true,
                    default: 1,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

cartSchema.methods.toJSON = function () {
    const obj = this._doc;
    delete obj.updatedAt;
    delete obj.__v;
    return obj;
};

module.exports = mongoose.model("Cart", cartSchema);
