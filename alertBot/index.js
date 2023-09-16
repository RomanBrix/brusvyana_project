// const express = require("express");
// const app = express();
// const dotenv = require("dotenv");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const BOT = require("./botSettings");
const botApi = require("./routes/api");
// const { default: mongoose } = require("mongoose");
// const Markup = require('telegraf').Markup
// const markup = Extra.markdown()
// console.log(Markup)

// const fs = require("fs");
// dotenv.config();
// const PORT = process.env.BOT_PORT || 5000;
// const BOT_MONGO_URL = process.env.BOT_MONGO_URL || "";

// mongoose
//     .connect(BOT_MONGO_URL)
//     .then(() => console.log("DB [BOT] Connected!"))
//     .catch((err) => {
//         console.log(err);
//     });

// app.use(cors());
// app.use(express.json());

// let alertsIdRaw = fs.readFileSync(__dirname + "/alerts.json");
// let alertsId = JSON.parse(alertsIdRaw);
// console.log(alertsId)

function useBot(app) {
    app.use("/bot", botApi);
}
module.exports = useBot;

//function to replace all dots in string with underscore
// function replaceDots(str) {
//     let withoutDots = str.replace(/\./g, "\\.");
//     let withoutUnderscore = withoutDots.replace(/\_/g, "\\_");
//     let withoutAsterisk = withoutUnderscore.replace(/\*/g, "\\*");
//     let withoutDash = withoutAsterisk.replace(/\-/g, "\\-");
//     let withoutOpenBracket = withoutDash.replace(/\(/g, "\\(");
//     let withoutCloseBracket = withoutOpenBracket.replace(/\)/g, "\\)");
//     let withoutOpenSquareBracket = withoutCloseBracket.replace(/\[/g, "\\[");
//     let withoutCloseSquareBracket = withoutOpenSquareBracket.replace(
//         /\]/g,
//         "\\]"
//     );
//     // console.log(withoutCloseSquareBracket);
//     return withoutCloseSquareBracket;
// }

// app.listen(PORT, () => {
//     console.log("Bot is running! port:  " + PORT);
// });
