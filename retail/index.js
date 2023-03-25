const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

// const fs = require('fs')
// const https = require('https');

const fileUpload = require("express-fileupload");

const catalogRoute = require("./routes/catalog");
const categoryRoute = require("./routes/category");
const productsRoute = require("./routes/products");
const orders = require("./routes/order");
const np = require("./routes/np");

dotenv.config();
const PORT = process.env.RETAIL_PORT || 5000;

mongoose
    .connect(process.env.RETAIL_MONGO_URL)
    .then(() => console.log("DB [RETAIL] Connected!"))
    .catch((err) => {
        console.log(err);
    });

app.use(cors());

app.use(express.json({ limit: "90mb" }));
app.use(fileUpload());

app.use("/api/catalog", catalogRoute);
app.use("/api/category", categoryRoute);
app.use("/api/products", productsRoute);
app.use("/api/orders", orders);
app.use("/api/np", np);

app.listen(PORT, () => {
    console.log("Backend server is running! port:  " + PORT);
});
