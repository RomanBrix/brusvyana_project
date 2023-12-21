//catalog Model
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//model of catalog
var catalogSchema = new Schema(
    {
        title: { type: String, required: true, unique: true },
        // SKU: { type: String, required: true, unique: true },
        // categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
        // products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Catalog", catalogSchema);
