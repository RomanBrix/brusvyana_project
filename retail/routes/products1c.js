const Catalog = require("../models/Catalog");
const Order = require("../models/Order");
const { Product, Variant } = require("../models/Product");

// const Category = require("../models/Category");

const { verifyAdmin } = require("./verifyToken");

const router = require("express").Router();

router.post("/catalogs", async (req, res) => {
    const data = req.body;
    console.log("try to load catalogs");
    try {
        // const newItems = await Catalog.insertMany(data, { ordered: false });
        await Catalog.insertMany(data);
        return res.status(201).json([]);
    } catch (err) {
        return res.status(200).json(false);
    }
});

router.put("/catalogs", async (req, res) => {
    const data = req.body; // [{SKU, title}]
    // console.log(data);
    try {
        //
        const bulkUpdateOps = data.map(({ SKU, title }) => ({
            updateOne: {
                filter: { SKU },
                update: { $set: { title } },
            },
        }));
        await Catalog.bulkWrite(bulkUpdateOps);

        return res.status(200).json([]);
    } catch (error) {
        console.log(error);
        return res.status(200).json(false);
    }
});
router.delete("/catalogs", async (req, res) => {
    // console.log(req.body);
    console.log("delete catalogs");
    const arrOfCatalogsSku = req.body;
    try {
        const bulkDeleteCatalogs = [];
        let productsQuery = arrOfCatalogsSku.map(async (item) => {
            bulkDeleteCatalogs.push({
                deleteOne: {
                    filter: { SKU: item.SKU },
                },
            });
            return await Product.find(
                { catalog: item.SKU },
                "catalog SKU variants"
            ).lean();
        });
        const result = (await Promise.all(productsQuery)).flat();
        const productsId = [];
        let variantsId = [];
        result.map((item) => {
            productsId.push(item._id);
            variantsId.push(item.variants);
        });
        variantsId = variantsId.flat();

        await Catalog.bulkWrite(bulkDeleteCatalogs);

        const deletedProds = await deleteProductsArray(productsId);
        const deletedVariks = await deleteManyVariantsByProductsArray(
            variantsId,
            true
        );
        console.log("deleted catalogs: " + bulkDeleteCatalogs.length);
        console.log("deleted products: ", +deletedProds);
        console.log("deleted variks: ", +deletedVariks);
        return res.status(200).json([]);
    } catch (error) {
        return res.status(200).json(false);
    }
});

router.post("/products", async (req, res) => {
    const data = req.body;
    console.log("try to load products");
    try {
        const catalogs = (await Catalog.find({}).lean()).map(
            (item) => item.SKU
        ); // OR _id
        console.log(catalogs);
        const { toSave, notToSave } = data.reduce(
            (acc, curr) => {
                console.log(curr.catalog);
                if (catalogs.includes(curr.catalog)) {
                    acc.toSave.push(curr);
                } else {
                    acc.notToSave.push(curr);
                }
                return acc;
            },
            { toSave: [], notToSave: [] }
        );
        await Product.insertMany(toSave);
        return res.status(200).json(notToSave);
    } catch (err) {
        console.log(err);
        res.status(200).json(false);
    }
});

router.put("/products", async (req, res) => {
    const data = req.body; // [{SKU, title}]
    // console.log(data);
    try {
        //
        let deleted = [];
        const updated = [];

        const bulkUpdateOps = data.map((item) => {
            const { SKU, ...other } = item;
            if (item.isAvailable) {
                updated.push(item);
                return {
                    updateOne: {
                        filter: { SKU },
                        update: { $set: { ...other } },
                    },
                };
            } else {
                deleted.push(item);
                return {
                    deleteOne: {
                        filter: { SKU },
                    },
                };
            }
        });

        const deletedVariants = await deleteManyVariantsByProductsArray(
            deleted
        );

        await Product.bulkWrite(bulkUpdateOps);
        console.log(`upd: ${updated.length}`);
        console.log(`deleted prod: ${deleted.length}`);
        console.log(`deleted varik: ${deletedVariants}`);

        // NEED TO DELETE VARIANTS

        return res.status(200).json([]);
    } catch (error) {
        console.log(error);
        return res.status(200).json(false);
    }
});

router.post("/variants", async (req, res) => {
    const data = req.body;
    const notIncluded = [];
    const sortedById = {};
    const productsIds = [];
    console.log("try to load variants");
    data.map((item) => {
        if (sortedById[item.productId]) {
            sortedById[item.productId].push(item);
        } else {
            sortedById[item.productId] = [item];
        }
        if (!productsIds.includes(item.productId))
            productsIds.push(item.productId);
    });
    // console.log(productsIds);
    // console.log(sortedById);

    try {
        for (let i = 0; i < productsIds.length; i++) {
            const prodId = productsIds[i];
            const product = await Product.findOne({ SKU: prodId });
            if (product) {
                const variants = await Variant.insertMany(sortedById[prodId]);
                product.variants.push(...variants.map((item) => item._id));
                await product.save();
                // console.log(variants);
            } else {
                notIncluded.push(...sortedById[prodId]);
            }
        }
        return res.status(200).json(notIncluded);
    } catch (err) {
        console.log(err);
        return res.status(200).json(false);
    }
});

router.put("/variants", async (req, res) => {
    const data = req.body; // [{SKU, title}]
    console.log("UPD/DELETE VARIANTS");
    try {
        //
        const deleted = [];
        const updated = [];

        const bulkUpdateOps = data.map((item) => {
            const { SKU, ...other } = item;
            if (item.isAvailable) {
                updated.push(item);
                return {
                    updateOne: {
                        filter: { SKU },
                        update: { $set: { ...other } },
                    },
                };
            } else {
                deleted.push(item);
                return {
                    deleteOne: {
                        filter: { SKU },
                    },
                };
            }
        });
        // console.log(bulkUpdateOps);
        await Variant.bulkWrite(bulkUpdateOps);
        console.log(`upd: ${updated.length}`);
        console.log(`deleted: ${deleted.length}`);

        return res.status(200).json([]);
    } catch (error) {
        console.log(error);
        return res.status(200).json(false);
    }
});

router.get("/orders", async (req, res) => {
    const { dateStart, dateEnd } = req.query;
    let from = dateStart;
    let to = dateEnd;
    if (!dateStart) {
        const today = new Date();
        today.setHours(0, 0, 1, 0); // Устанавливаем время на 00:01
        from = today;
    }
    if (!dateEnd) {
        const today = new Date();
        today.setHours(23, 59, 59, 0); // Устанавливаем время на 00:01
        to = today;
    }

    try {
        const orders = await Order.find({
            createdAt: {
                $gte: from,
                $lte: to,
            },
        }).lean();
        console.log(orders.length);
        return res.status(200).json(orders);
    } catch (err) {
        return res.status(500).json(false);
    }
});

module.exports = router;

async function deleteManyVariantsByProductsArray(arr, type = false) {
    let bulkVarikDelete = [];

    if (type) {
        arr.map((id) => {
            bulkVarikDelete.push({
                deleteOne: {
                    filter: { _id: id },
                },
            });
        });
        await Variant.bulkWrite(bulkVarikDelete);
        return bulkVarikDelete.length;
    }

    const products = arr.map(async ({ SKU }) => {
        return await Product.findOne({ SKU }, "variants").lean();
    });

    await Promise.all(products).then((res) => {
        res.filter((item) => item.variants.length > 0).map((item) => {
            item.variants.map((varId) => {
                console.log(varId);
                bulkVarikDelete.push({
                    deleteOne: {
                        filter: { _id: varId },
                    },
                });
            });
        });
    });
    await Variant.bulkWrite(bulkVarikDelete);
    return bulkVarikDelete.length;
}

async function deleteProductsArray(arr) {
    const delProd = arr.map((id) => ({
        deleteOne: {
            filter: { _id: id },
        },
    }));
    await Product.bulkWrite(delProd);
    return delProd.length;
}
