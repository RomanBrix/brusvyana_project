//model of product
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var productSchema = new Schema(
    {
        title: { type: String, required: true, unique: true },
        description: { type: String },
        price: { type: Number },
        image: { type: String },
        quantity: { type: Number }, // NOT REQ
        quantity_tag: { type: String, default: "шт" }, // NOT REQ
        isAvailable: { type: Boolean, default: true }, // NOT REQ
        SKU: { type: String, unique: true },
        variants: [{ type: Schema.Types.ObjectId, ref: "Variant" }],
        // catalog: { type: Schema.Types.ObjectId, ref: "Catalog" },
        catalog: { type: String },
        // barcode: { type: String, default: "" },
        // category: { type: Schema.Types.ObjectId, ref: "Category" },
        category: { type: String, default: "" },
    },
    { timestamps: true }
);

var variantSchema = new Schema(
    {
        title: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, default: null },
        quantity: { type: Number, required: true },
        SKU: { type: String, unique: true },
        isAvailable: { type: Boolean, default: true }, // NOT REQ
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
const Variant = mongoose.model("Variant", variantSchema);
module.exports = { Product, Variant };

// module.exports = mongoose.model('Variant', variantSchema);

// catalog -> products (variant: ['id1', 'id2']) -> variants(id: 'asdasd', parentID: 'asdasdasd')
