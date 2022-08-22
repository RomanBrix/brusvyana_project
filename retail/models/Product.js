//model of product
var mongoose = require('mongoose');
var Schema = mongoose.Schema;




var productSchema = new Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
    variants: [{ type: Schema.Types.ObjectId, ref: 'Variant' }],
    category: { type: Schema.Types.ObjectId, ref: 'Category' }
}, { timestamps: true });



var variantSchema = new Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: null },
    quantity: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });


const Product = mongoose.model('Product', productSchema);
const Variant = mongoose.model('Variant', variantSchema);
module.exports = { Product, Variant };

// module.exports = mongoose.model('Variant', variantSchema);