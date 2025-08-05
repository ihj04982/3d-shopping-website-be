const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
    {
        userId: {
            type: mongoose.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            default: "preparing",
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0,
        },
        shipTo: {
            type: String,
            required: true,
        },
        contact: {
            type: String,
            required: true,
        },
        orderNum: {
            type: String,
        },
        items: [
            {
                productId: {
                    type: mongoose.ObjectId,
                    ref: "Product",
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                color: {
                    type: String,
                    required: true,
                },
                qty: {
                    type: Number,
                    required: true,
                    min: 1,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

orderSchema.methods.toJSON = function () {
    const obj = this._doc;
    delete obj.updatedAt;
    delete obj.__v;
    return obj;
};

module.exports = mongoose.model("Order", orderSchema);
