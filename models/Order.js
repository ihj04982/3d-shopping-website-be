const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Cart = require("./Cart");

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
            type: Object,
            required: true,
        },
        contact: {
            type: Object,
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

orderSchema.post("save", async function () {
    const cart = await Cart.findOne({ userId: this.userId });
    cart.items = [];
    await cart.save();
});
module.exports = mongoose.model("Order", orderSchema);
