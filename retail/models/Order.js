// model of category
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var orderSchema = new Schema(
    {
        id: { type: String, default: null, unique: true },
        user: { type: String, default: null },
        guestUser: { type: Schema.Types.Mixed, default: null },
        // products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
        // variants: [{ type: Schema.Types.ObjectId, ref: 'Variant' }],
        productsBuyList: [{ type: Schema.Types.Mixed, default: null }],
        productsWhenBuy: [{ type: Schema.Types.Mixed, default: null }],
        totalPrice: { type: Number, default: 0 },
        status: { type: String, default: "bought" },
        paymanetMethod: { type: String, default: "cash" },
        deliveryMethod: { type: String, default: "self" },
        // notes: [{ type: Schema.Types.Mixed, default: null, timestamps: true } ],
        notes: [
            {
                text: { type: String, default: null },
                author: { type: String, default: null },
                date: { type: Date, default: Date.now },
                // default: null
            },
            { default: [] },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
