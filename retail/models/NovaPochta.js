// model of category
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var novaPochtaSchema = new Schema({
    cities: { type: Schema.Types.Mixed },
    warehouses: { type: Schema.Types.Mixed}
}, { timestamps: true });

module.exports = mongoose.model('Novapochta', novaPochtaSchema);