var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var botUserSchema = new Schema(
    {
        id: { type: Number, required: true, unique: true },
        username: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("BotUser", botUserSchema);
