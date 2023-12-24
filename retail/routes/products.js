const { doFileMagick, deleteFile, extracFile } = require("../doFileMagick");
const Category = require("../models/Category");
const Catalog = require("../models/Catalog");
const { Product, Variant } = require("../models/Product");

const { verifyUser, verifyAdmin } = require("./verifyToken");
// const fileUpload = require("express-fileupload");
const multer = require("multer");
const fs = require("fs");
var path = require("path");
const sharp = require("sharp");

const pathToPublicProducts = path.resolve("../../src/products/");
// const pathToPublicProducts = __dirname + '/../../../front/public/src/products/';
// const pathToPublicProducts = __dirname + "/../../src/products/";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = "uploads/";
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Укажите имя файла после его загрузки
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

const router = require("express").Router();

const LIMIT = 10; // FOR PAGINATION
router.get("/adminRequest", verifyAdmin, async (req, res) => {
    const { options, limit } = req.query;
    const { page, search } = JSON.parse(options);
    const activeLimit = limit || LIMIT;

    let title = { $regex: "", $options: "i" };
    if (search) {
        title = { $regex: search, $options: "i" };
    }

    const products = await Product.find(
        {
            title,
        },
        "title price image createdAt variants"
    )
        .populate({ path: "category", select: "title" })
        .sort({ createdAt: -1 })
        .skip((page - 1) * activeLimit)
        .limit(activeLimit)
        .lean();

    return res.status(200).json(products);
});

//get all products
router.get("/", async (req, res) => {
    const globTime = new Date();

    try {
        // const products = await Product.find().populate({path: 'variants', select: ['title', "price", "image", "quantity", "isAvailable"]}).sort({ price: 1 }).lean();
        const products = await Product.find()
            .populate({
                path: "variants",
                select: ["title", "price", "image", "quantity", "isAvailable"],
            })
            .sort({ price: 1 })
            .lean();

        const time = new Date() - globTime;
        console.log(`Time to get all products: ${time} ms`);
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/idsAdmin", verifyAdmin, async (req, res) => {
    try {
        const products = await Product.find(
            { _id: { $in: req.query.ids } },
            "title description price image quantity isAvailable"
        )
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json(products);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get("/ids", async (req, res) => {
    try {
        const products = await Product.find(
            { category: { $in: req.query.ids } },
            "title description price image quantity isAvailable"
        )
            .sort({ createdAt: -1 })
            .limit(LIMIT)
            .lean();

        res.status(200).json(products);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get("/cart", async (req, res) => {
    const { ids } = req.query;

    try {
        const products = await Product.find(
            { _id: { $in: ids } },
            "title price image variants"
        )
            .populate({ path: "variants", select: "title price" })
            .lean();
        res.status(200).json(products);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

//QUERY LOAD
router.get("/query", async (req, res) => {
    const { options, limit } = req.query;
    const { category, catalog, page } = JSON.parse(options);
    const activeLimit = limit || LIMIT;

    if (category) {
        try {
            const products = await Product.find(
                { category: { $in: category } },
                "title description price image quantity isAvailable"
            )
                .sort({ createdAt: -1 })
                .skip((page - 1) * activeLimit)
                .limit(activeLimit)
                .lean();
            console.log("ok by category");
            return res.status(200).json(products);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    } else {
        try {
            const catalogs = await Catalog.findById(catalog, "categories")
                .populate({ path: "categories", select: "products" })
                .lean();
            //count products
            let productsIds = catalogs.categories.reduce((acc, curr) => {
                return acc.concat(curr.products);
            }, []);

            const products = await Product.find(
                { _id: { $in: productsIds } },
                "title description price image quantity isAvailable"
            )
                .sort({ createdAt: -1 })
                .skip((page - 1) * activeLimit)
                .limit(activeLimit)
                .lean();
            return res.status(200).json(products);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }
});

//category LOAD
router.get("/category", async (req, res) => {
    const { category } = req.query;

    try {
        //get products by catalog
        const count = await Product.countDocuments({ category: category });

        const products = await Product.find(
            { category: category },
            "title description price image quantity isAvailable"
        )
            .sort({ createdAt: -1 })
            .limit(LIMIT)
            .lean();
        // const products = await Product.find({ '_id': { $in: req.query.ids } }, 'title description price image quantity isAvailable').sort({ createdAt: -1 }).lean();

        res.status(200).json({ products, count });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

//get product by id
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate({
                path: "variants",
                select: ["title", "price", "image", "quantity", "isAvailable"],
            })
            .lean();
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
});

//delete product
router.delete("/:id", verifyAdmin, async (req, res) => {
    const id = req.params.id;
    try {
        const category = await Category.find(
            { products: { $in: [id] } },
            "products"
        ).lean();

        if (category.length > 0) {
            category.forEach(async (cat) => {
                cat.products = cat.products.filter((product) => product != id);

                await Category.findByIdAndUpdate(cat._id, cat);
            });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ msg: "Product not found" });
        }

        if (product.variants.length > 0) {
            await Variant.deleteMany({ _id: { $in: product.variants } });
        }
        const imgName = product.image;
        deleteFile(pathToPublicProducts + "/" + imgName);
        await product.remove();
        res.status(200).json(true);
    } catch (err) {
        res.status(500).json(err);
    }
});

//update product
router.put("/:id", verifyAdmin, async (req, res) => {
    const productId = req.params.id;
    const categoryId = req.body.category;
    const { product } = req.body;

    const { variants } = product;
    const variantsToDelete = variants
        .filter((variant) => variant.flag === "delete")
        .map((variant) => {
            delete variant.flag;
            return variant;
        });
    const variantsToUpdate = variants
        .filter((variant) => variant.flag === "update")
        .map((variant) => {
            delete variant.flag;
            return variant;
        });
    const variantsToAdd = variants
        .filter((variant) => variant.flag === "add")
        .map((variant) => {
            delete variant.flag;
            variant.quantity = +variant.quantity;
            variant.price = +variant.price;
            variant.isAvailable = variant.quantity > 0;
            if (!variant.image) {
                return {
                    ...variant,
                    image: product.image,
                };
            }
            return variant;
        });
    const mainProduct = {
        _id: productId,
        title: product.title,
        description: product.description,
        price: product.price,
        image: product.image || "",
        quantity: product.quantity || 0,
        isAvailable: product.quantity > 0,
    };

    if (variantsToDelete.length > 0) {
        deleteVariantsPerUpdate(variantsToDelete);
    }
    if (variantsToUpdate.length > 0) {
        updateVariantsPerUpdate(variantsToUpdate);
    }

    let variantsToDeleteIds = [];

    if (variantsToAdd.length > 0) {
        const newIds = await addVariantsPerUpdate(variantsToAdd);

        if (variantsToDelete.length > 0) {
            variantsToDeleteIds = variantsToDelete.map(
                (variant) => variant._id
            );
        }
        await Product.findByIdAndUpdate(productId, {
            $set: mainProduct,
            $push: { variants: { $each: newIds } },
        });
    } else {
        if (variantsToDelete.length > 0) {
            variantsToDeleteIds = variantsToDelete.map(
                (variant) => variant._id
            );
        }
        await Product.findByIdAndUpdate(productId, { $set: mainProduct });
    }

    if (variantsToDelete.length > 0) {
        await Product.updateMany(
            { variants: { $in: variantsToDeleteIds } },
            { $pull: { variants: { $in: variantsToDeleteIds } } }
        );
    }

    if (categoryId) {
        await Category.findOneAndUpdate(
            { products: productId },
            { $pull: { products: productId } }
        );
        await Category.findByIdAndUpdate(categoryId, {
            $push: { products: productId },
        });
    }

    res.status(200).json(true);
});
// try {

router.post("/", verifyAdmin, async (req, res) => {
    try {
        const added = await addProduct(req.body.product, req.body.category);

        res.status(200).json(added);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post("/new", verifyAdmin, async (req, res) => {
    const { image } = req.files;
    let { product } = req.body;

    if (image) {
        product = JSON.parse(product);
        if (!/^image/.test(image.mimetype)) return res.sendStatus(400);
        // try

        image.mv(pathToPublicProducts + "/" + image.name);

        product.image = image.name;
    }

    const prod = await addProduct(product);

    res.status(200).json(prod);
});

// LOAD CSV AND ADD DATA  fileUpload
router.post(
    "/fileMagick",
    verifyAdmin,
    upload.single("csv"),
    async (req, res) => {
        const csv = req.file || false;

        let status = 200;
        let msg = "";
        const otherData = {};
        if (csv) {
            const path_to_csv = csv.path;

            doFileMagick(path_to_csv, async (err, parsData) => {
                if (err) {
                    console.log("err:");
                    console.log(err);
                    return;
                }

                const catalog = req.body.catalogId;

                //get list of original and all categories___________
                const allCategories = parsData.map((item) => item.category);
                const originalCategories = [...new Set(allCategories)];

                // GET VARIANTS FOR PRODUCT_______________________________________________________________
                let variants = parsData.map((item) => {
                    const variantsKeys = Object.keys(item).filter(
                        (i) => i.includes("variant") && i.includes("title")
                    );

                    if (variantsKeys.length === 0) {
                        return [];
                    } else {
                        variantToReturn = [];
                        for (let i = 1; i <= variantsKeys.length; i++) {
                            if (
                                item[`variant_${i}_title`] ||
                                item[`variant_${i}_price`]
                            ) {
                                variantToReturn.push({
                                    title: item[`variant_${i}_title`],
                                    quantity:
                                        item[`variant_${i}_quantity`] || 1,
                                    price: item[`variant_${i}_price`] || 1,
                                });
                            } else {
                                continue;
                            }
                        }
                        return variantToReturn;
                    }
                });

                // ADD VARIANTS _______________________________________________________________
                let minPrice = variants.map((item) => {
                    if (item.length > 0) {
                        return +item
                            .map((variant) => variant.price)
                            .sort((a, b) => +a - +b)[0];
                    } else {
                        return null;
                    }
                });
                let variantError = false;
                let addedVariants = [];
                let notAddedVariants = [];
                for (let i = 0; i < variants.length; i++) {
                    if (variants[i].length > 0) {
                        try {
                            let ids = await Variant.insertMany(variants[i]);
                            addedVariants.push(ids.map((id) => id._id));
                        } catch (insertError) {
                            status = 500;
                            msg = `Невідома помилка при завантаженні варіанту товара`;

                            notAddedVariants.push(variants[i]);

                            if (
                                insertError?._message ===
                                "Variant validation failed"
                            ) {
                                msg = `У варіанта продукта (№${
                                    i + 1
                                }) не заповнене, або не правильно заповнене поле: ${
                                    insertError.errors.title.path
                                }`;
                            }

                            await Variant.deleteMany({
                                _id: { $in: addedVariants },
                            });
                            variantError = true;
                            break;
                            // return;
                        }
                    } else {
                        addedVariants.push([]);
                    }
                }

                if (variantError) {
                    fs.unlinkSync(path_to_csv);
                    return res.status(status).json({
                        status: status,
                        msg: msg,
                        otherData,
                    });
                }

                // END ADD VARIANTS _______________________________________________________________

                //  // MAKE PRODUCTS_______________________________________________________________
                let products = parsData.map((item, index) => {
                    return {
                        title: item.title,
                        description: item.description,
                        image: item.image,
                        price:
                            minPrice[index] === null
                                ? +item.price
                                : minPrice[index],
                        quantity: +item.quantity,
                        category: item.category,
                        catalog: catalog,
                        variants: addedVariants[index],
                    };
                });

                // // products = pro

                try {
                    const pr = await Product.insertMany(products);

                    status = 200;
                    msg = `Все ок!`;
                    otherData.loadLength = pr.length;
                    // const toCalckLenth = addedVariants.map();
                    otherData.variantLoadLength = addedVariants.flat().length;
                } catch (insertError) {
                    // const notAddedProducts = products.filter(
                    //     (i, n) => n >= insertError.insertedDocs.length
                    // );

                    // const removeVariants = notAddedProducts
                    //     .map((i) => i.variants)
                    //     .flat();
                    const removeProducts = insertError.insertedDocs.map(
                        (i) => i._id
                    );

                    await Product.deleteMany({ _id: { $in: removeProducts } });
                    await Variant.deleteMany({
                        _id: { $in: addedVariants.flat() },
                    });

                    if (insertError?.code === 11000) {
                        status = 500;
                        msg = `Повторный продукт: #${
                            insertError.insertedDocs.length + 1
                        }`;
                        // return res.status(500).json({
                        //     msg: `Повторный продукт: #${
                        //         insertError.insertedDocs.length + 1
                        //     }`,
                        // });

                        // return;
                    } else {
                        status = 500;
                        msg = `Невідома помилка при завантаженні товару, скоріше за все не правильно заповнене якесь поле, перевірте товар під номером ${
                            insertError.insertedDocs.length + 1
                        }`;
                        // return;
                    }
                }

                fs.unlinkSync(path_to_csv);
                return res.status(status).json({
                    status: true,
                    msg: msg,
                    otherData,
                });

                // // END MAKE PRODUCTS_______________________________________________________________
            });

            return;
        } else {
            return res.status(400).json({ msg: "No file" });
        }
    }
);

// LOAD ZIP OF IMGS
router.post(
    "/productMagick",
    verifyAdmin,
    upload.single("zip"),
    async (req, res) => {
        console.log("go load zip photos");
        // const { zip } = req.files;
        console.log(req.file);
        const file_path_zip = req.file?.path || false;

        let status = 200;
        let msg = "";
        let otherData = {};
        // front/public/src/prdoucts/
        if (file_path_zip) {
            // const path = pathToPublicProducts + "/";
            const pathtoUnload = path.resolve("uploads/tempImg");

            let extracting = await extracFile(file_path_zip, pathtoUnload);
            const files = await fs.readdirSync(pathtoUnload);

            let imgToBlob = {};
            // files.forEach(async (img) => {

            // });
            for (let i = 0; i < files.length; i++) {
                const img = files[i];
                const imgBlob = await compressToPng(pathtoUnload + "/" + img);
                sharp.cache({ files: 0 });

                imgToBlob[img] = imgBlob;
            }

            for (let i = 0; i < files.length; i++) {
                const img = files[i];
                const newImg = imgToBlob[img];

                try {
                    await Product.updateMany(
                        { image: img },
                        { $set: { image: newImg } }
                    );
                } catch (err) {
                    console.log(err);
                    status = 500;
                    msg = "Невідома помилка при завантаженні фото";
                    break;
                }
            }
            otherData.loadLength = files.length;

            deleteFolderRecursive(pathtoUnload);
        }
        return res.status(status).json({
            msg: msg,
            otherData,
        });
    }
);

async function deleteVariantsPerUpdate(products) {
    await Variant.deleteMany({ _id: { $in: products } });
}
async function updateVariantsPerUpdate(products) {
    for (let i = 0; i < products.length; i++) {
        await Variant.findByIdAndUpdate(products[i]._id, { $set: products[i] });
    }
    return true;
    // return await Variant.updateMany({_id: {$in: products}}, {$set: products});
}
async function addVariantsPerUpdate(products) {
    const newVariants = await Variant.insertMany(products);
    const ids = newVariants.map((variant) => variant._id);
    return ids;
}

async function addProduct(product) {
    let variantsIds = [];
    let price = product.price;
    let qnty = product.quantity || 1;
    if (product?.variants && product?.variants.length > 0) {
        let ids = await Variant.insertMany(product.variants);
        let pr = ids[0].price;
        variantsIds = ids.map((variant) => {
            if (pr > variant.price) {
                price = pr;
            }
            qnty += variant.quantity;
            return variant._id;
        });
    }

    const newProduct = new Product({
        title: product.title,
        description: product.description,
        price,
        variants: variantsIds,
        image: product.image,
        quantity: qnty,
        category: product.category,
        isAvailable: qnty > 0,
    });

    try {
        let added = await newProduct.save();

        const searchedCategory = await Category.findById(product.category);
        searchedCategory.products.push(added._id);
        await searchedCategory.save();
        return added;
    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports = router;

async function compressToPng(filePath) {
    if (!filePath) return false;

    const { addOptions } = this;

    const options = {
        quality: 70, // Качество изображения (0-100)
        chromaSubsampling: "4:4:4", // Сохранение цветовой информации
        trellisQuantisation: true, // Оптимизация квантования
    };
    try {
        let shrp = sharp(filePath).png(options);
        if (addOptions) {
            shrp = __addOptions(shrp, addOptions);
        }
        const buff = await shrp.toBuffer();
        return "data:image/png;base64, " + buff.toString("base64");
    } catch (err) {
        console.log(err);
        return false;
    }
}

function __addOptions(shrp, addOptions) {
    let mutedObject = shrp;

    for (const property in addOptions) {
        mutedObject = mutedObject[property](addOptions[property]);
    }

    return mutedObject;
}
function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file) => {
            const curPath = path + "/" + file;

            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });

        fs.rmdirSync(path);
        console.log("Folder deleted successfully");
    }
}
