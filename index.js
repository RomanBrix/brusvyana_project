const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const useRetail = require("./retail");
const useBot = require("./alertBot");
const useUser = require("./user");

dotenv.config();

const PORT = process.env.RETAIL_PORT || 5000;

mongoose
    .connect(process.env.COUPLE_MONGO_URL)
    .then(() => console.log("DB [ALL] Connected!"))
    .catch((err) => {
        console.log(err);
    });

app.use(cors());

useRetail(app);
useBot(app);
useUser(app);
// app.use();

app.listen(PORT, () => {
    console.log("Backend server is running! port:  " + PORT);
});
