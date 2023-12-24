const Catalog = require("../models/Catalog");
const Category = require("../models/Category");
const { Product, Variant } = require("../models/Product");

const { verifyUser, verifyAdmin } = require("./verifyToken");

const router = require("express").Router();

//Get all catalogs
// router.get("/", async (req, res) => {
//     console.log("get all catalogs");

//     try {
//         const catalogs = await Catalog.find({}, "title SKU").lean();
//         res.status(200).json(catalogs);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json(err);
//     }
// });
router.get("/", async (req, res) => {
    console.log("get all catalogs");

    try {
        const catalogs = await Catalog.aggregate([
            { $addFields: { catalogId: { $toString: "$_id" } } },
            {
                // $lookup: {
                //     from: "products",
                //     localField: "catalogId",
                //     foreignField: "catalog",
                //     as: "prodData",
                // },
                $lookup: {
                    from: "products",
                    let: { catalogId: "$catalogId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$catalog", "$$catalogId"] },
                            },
                        },
                        {
                            $project: {
                                title: 1,
                                _id: 1,
                            },
                        },
                    ],
                    as: "prodData",
                },
            },
            {
                $addFields: {
                    products: { $size: "$prodData" },
                },
            },
            {
                $unset: "prodData",
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $match: {
                    title: { $regex: "", $options: "i" },
                },
            },
        ]);

        // console.log(catalogs);

        res.status(200).json(catalogs);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

//get populet categories
router.get("/:id/categories", async (req, res) => {
    try {
        const catalogs = await Catalog.findById(req.params.id, "categories")
            .populate({ path: "categories", select: "title products" })
            .lean();
        res.status(200).json(catalogs);
    } catch (err) {
        console.log(err.kind);
        if (err.kind === "ObjectId") {
            return res.status(404).json({ message: "Catalog not found" });
        }

        res.status(500).json(err);
    }
});

router.get("/catalogProducts", async (req, res) => {
    try {
        const catalogs = await Catalog.findById(req.query.id, "categories")
            .populate({ path: "categories", select: "products" })
            .lean();
        //count products
        let count = catalogs.categories.reduce((acc, curr) => {
            return acc + curr.products.length;
        }, 0);

        res.status(200).json(count);
    } catch (error) {
        console.log(error.kind);
        if (error.kind === "ObjectId") {
            return res.status(404).json({ message: "Catalog not found" });
        }

        res.status(500).json(error);
    }
});

//Get catalog by id
router.get("/:id", async (req, res) => {
    console.log("iD: ", req.params);
    try {
        // const catalog = await Catalog.findById(req.params.id).populate(
        //     "categories"
        // );

        const catalog = await Catalog.findById(req.params.id).lean();

        if (!catalog) {
            throw new Error("Catalog not found");
        }

        const categories = await Category.find({ catalog: catalog._id }).lean();

        const dataToSend = {
            ...catalog,
            categories,
            //   categories: categories.map(category => category.title)
        };
        console.log(dataToSend);
        res.status(200).json(catalog);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

//Create catalog
router.post("/", verifyAdmin, async (req, res) => {
    // verifyAdmin
    // console.log(req.body);
    // return res.status(201);
    const catalog = new Catalog({
        title: req.body.title,
    });
    console.log("here");
    try {
        const newCatalog = await catalog.save();
        // console.log(newCatalog);
        return res.status(201).json(newCatalog);
    } catch (err) {
        console.log(err);
        if (err?.code === 11000) {
            return res.status(400).json("Catalog already exists");
        }
        return res.status(400).json(err);
    }
});

//add category to catalog
router.post("/:id/category", verifyAdmin, async (req, res) => {
    try {
        const catalog = await Catalog.findById(req.params.id);
        catalog.categories.push(req.body.category);
        await catalog.save();
        res.status(200).json(catalog);
    } catch (err) {
        res.status(500).json(err);
    }
});

//delete catalog
router.delete("/:id", async (req, res) => {
    const id = req.params?.id;

    // console.log(id);
    // const catalog = await Catalog.deleteOne({ SKU: id }).lean();
    try {
        if (!id) throw new Error("No id");
        const catalog = await Catalog.deleteOne({ _id: id }).lean();
        // for variants
        const products = await Product.find({ catalog: id }).lean();
        const variantsToDelete = products.map((i) => i.variants).flat();
        const productsDeleted = await Product.deleteMany({
            catalog: id,
        }).lean();
        const deletedVariants = await Variant.deleteMany({
            _id: { $in: variantsToDelete },
        });
        console.log(deletedVariants);
        // console.log(variantsToDelete.length);

        res.status(200).json({
            catalogs: catalog.deletedCount,
            products: productsDeleted.deletedCount,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(false);
    }
});

//old delete
// router.delete("/:id", async (req, res) => {
//     // verifyAdmin
//     try {
//         const category = await Category.find(
//             { catalog: { $in: req.params.id } },
//             "products"
//         ).lean();
//         //get length of all products
//         const productsLength = category.reduce((acc, curr) => {
//             return acc + curr.products.length;
//         }, 0);

//         if (productsLength > 0) {
//             return res.status(400).json("Catalog has products");
//         } else {
//             //delete category
//             console.log(Category);
//             await Category.deleteMany({ catalog: { $in: req.params.id } });
//             await Catalog.findByIdAndDelete(req.params.id);
//             return res.status(200).json(true);
//         }
//         // const catalog = await Catalog.findByIdAndDelete(req.params.id).lean();
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

module.exports = router;
