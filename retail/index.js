const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const catalogRoute = require("./routes/catalog");
const categoryRoute = require("./routes/category");
const productsRoute = require("./routes/products");

dotenv.config();
const PORT = process.env.RETAIL_PORT || 5000;

mongoose
  .connect(process.env.RETAIL_MONGO_URL)
  .then(() => console.log("DB [RETAIL] Connected!"))
  .catch((err) => {
    console.log(err);
  });


app.use(cors());
app.use(express.json());

app.use("/api/catalog", catalogRoute);
app.use("/api/category", categoryRoute);
app.use("/api/products", productsRoute);

app.listen(PORT, () => {
    console.log("Backend server is running! port:  " + PORT);
});