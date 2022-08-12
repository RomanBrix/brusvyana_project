// model of category
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var categorySchema = new Schema({
    title: { type: String, required: true, unique: true },
    catalog: { type: Schema.Types.ObjectId, ref: 'Catalog' },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);