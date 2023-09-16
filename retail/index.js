const express = require("express");
// const app = express();
// const dotenv = require("dotenv");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const fs = require('fs')
// const https = require('https');

const fileUpload = require("express-fileupload");

const catalogRoute = require("./routes/catalog");
const categoryRoute = require("./routes/category");
const productsRoute = require("./routes/products");
const orders = require("./routes/order");
const np = require("./routes/np");

const vacancyRoute = require("./routes/vacancy");
const prod1cRoute = require("./routes/products1c");
const productsV2Route = require("./routes/productsV2");

function useRetail(app) {
    app.use(express.json({ limit: "5mb" }));
    // app.use(fileUpload());
    // console.log("asdasdas");
    app.use("/api/catalog", catalogRoute);
    app.use("/api/category", categoryRoute);
    app.use(
        "/api/products",
        express.json({ limit: "15mb" }),
        fileUpload,
        productsRoute
    );
    app.use("/api/productsV2", productsV2Route);
    app.use("/api/orders", orders);
    app.use("/api/np", express.json({ limit: "90mb" }), np);

    app.use("/api/vacancy", vacancyRoute);

    // app.use("/api/1c-auth", prod1cRoute);
    app.use("/api/1c", prod1cRoute);
    app.get("/api/1c", (req, res) => {
        console.log("req.body:");
        console.log(req.body);
        console.log("req.params:");
        console.log(req.params);
        console.log("req.query:");
        console.log(req.query);
        res.json({ status: true, type: "GET" });
    });
}

module.exports = useRetail;
