const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");

const productSchema = new Schema(
    {
        sku: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        category: {
            type: Array,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        stock: {
            type: Object,
            required: true,
        },
        status: {
            type: String,
            default: "active",
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

productSchema.methods.toJSON = function () {
    const obj = this._doc;
    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;
    return obj;
};

module.exports = mongoose.model("Product", productSchema);
