var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var vacancySchema = new Schema(
    {
        title: { type: String, default: "" },
        text: { type: String, default: "" },
        g_form: { type: String, default: "" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Vacancy", vacancySchema);
