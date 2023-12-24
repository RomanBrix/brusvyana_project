const Catalog = require("../models/Catalog");
const { Product, Variant } = require("../models/Product");
const router = require("express").Router();
const { verifyUser, verifyAdmin } = require("./verifyToken");

router.get("/prod-count", async (req, res) => {
    const { catalog, category } = req.query;
    const findObj = {};

    if (catalog) findObj.catalog = catalog;
    if (category) findObj.category = category;
    try {
        const count = await Product.countDocuments(findObj);
        res.status(200).json(count);
    } catch (err) {
        console.log(err);
        res.status(500).json(false);
    }
});
router.get("/products", async (req, res) => {
    try {
        const queryData = req.query;
        const limit = 10; // Количество записей на странице
        const pageNumber = queryData.pageQuery; // Номер страницы (начинается с 1)
        const { searchQuery } = queryData; // Запрос поиска

        const skipAmount = (pageNumber - 1) * limit;

        // const products = await Product.find({});
        const products = await Product.aggregate([
            {
                $lookup: {
                    from: "catalogs",
                    localField: "catalog",
                    foreignField: "SKU",
                    as: "catalogData",
                },
            },
            {
                $set: {
                    catalog: { $arrayElemAt: ["$catalogData.title", 0] },
                    variants: { $size: "$variants" },
                },
            },
            {
                $match: {
                    title: { $regex: searchQuery, $options: "i" },
                },
            },
            {
                $sort: {
                    SKU: -1,
                },
            },
            {
                $unset: "catalogData",
            },
            {
                $skip: skipAmount,
            },
            {
                $limit: limit,
            },
        ]);
        // throw new Error("asdasd");
        res.status(200).json(products);
    } catch (err) {
        console.log(err);
        res.status(500).json(false);
    }
});

router.get("/catalog-prod", async (req, res) => {
    const { catalog, category = "", page = 1 } = req.query;
    // console.log("category: ", category);
    // console.log("catalog: ", catalog);
    // console.log("page: ", page);
    const limit = 20;
    const skipAmount = (page - 1) * limit;

    try {
        const products = await Product.aggregate([
            {
                $match: {
                    catalog: catalog,
                    category: category !== "" ? category : { $exists: true },
                },
            },
            {
                $skip: skipAmount,
            },
            {
                $limit: limit,
            },
        ]);

        res.status(200).json(products);
    } catch (err) {
        console.log(err);
        res.status(500).json(false);
    }
});

router.get("/catalogs-category", async (req, res) => {
    const { catalog } = req.query;

    try {
        const uniqueCategories = await Product.distinct("category", {
            catalog: catalog,
        });

        res.status(200).json(uniqueCategories);
    } catch (err) {
        console.log(err);
        res.status(500).json(false);
    }
});

router.get("/product/:id", async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) throw new Error("no id");
        const product = await Product.findById(id).populate("variants").lean();

        res.status(200).json(product);
    } catch (err) {
        console.log(err);
        res.status(500).json(false);
    }
});

router.get("/cart", async (req, res) => {
    const { ids } = req.query;
    // console.log('first')

    try {
        const products = await Product.find(
            { _id: { $in: ids } },
            "title price image variants SKU"
        )
            .populate({ path: "variants", select: "title price SKU" })
            .lean();
        res.status(200).json(products);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;
