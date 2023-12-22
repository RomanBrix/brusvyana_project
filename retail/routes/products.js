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
    console.log("first");
    console.log(req.query);
    const { options, limit } = req.query;
    const { page, search } = JSON.parse(options);
    const activeLimit = limit || LIMIT;
    // console.log( page, activeLimit);
    let title = { $regex: "", $options: "i" };
    if (search) {
        title = { $regex: search, $options: "i" };
    }

    console.log(title);
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
    // console.log('first')
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
    // console.log("req.query.ids: " + req.query.ids);
    // console.log(req.query.ids)
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
    // console.log("req.query.ids: " + req.query.ids);
    // console.log(req.query.ids)
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
    // console.log('first')

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
    console.log("QUER____");
    // console.log(req.query);
    const { options, limit } = req.query;
    const { category, catalog, page } = JSON.parse(options);
    const activeLimit = limit || LIMIT;
    console.log(category, catalog, page, activeLimit);

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
            // console.log(productsIds)
            return res.status(200).json(products);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }
});

//category LOAD
router.get("/category", async (req, res) => {
    console.log("params");
    // console.log(req.params);
    // console.log(req.query);

    const { category } = req.query;

    // res.status(200).json(true);
    // console.log(req.query.ids)
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
    // console.log('object');
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
    // console.log(product)
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

    // console.log('variantsToDelete', variantsToDelete);
    // console.log('variantsToUpdate', variantsToUpdate);
    // console.log('variantsToAdd', variantsToAdd);
    console.log("mainProduct", mainProduct);
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

    // console.log(ok)
    res.status(200).json(true);
});
// try {

router.post("/", verifyAdmin, async (req, res) => {
    // console.log(req.body)
    try {
        const added = await addProduct(req.body.product, req.body.category);
        console.log(added);
        res.status(200).json(added);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post("/new", verifyAdmin, async (req, res) => {
    const { image } = req.files;
    let { product } = req.body;
    // console.log();
    if (image) {
        product = JSON.parse(product);
        if (!/^image/.test(image.mimetype)) return res.sendStatus(400);
        // try
        console.log("MOOOOOOVE");
        console.log(pathToPublicProducts + "/" + image.name);
        image.mv(pathToPublicProducts + "/" + image.name);

        product.image = image.name;
    }

    // console.log(product);
    const prod = await addProduct(product);

    res.status(200).json(prod);
});

// LOAD CSV AND ADD DATA  fileUpload
router.post(
    "/fileMagick",
    verifyAdmin,
    upload.single("csv"),
    async (req, res) => {
        console.log("GO LOAD");
        console.log(req.file);

        // console.log(req.body);
        const csv = req.file || false;

        let status = 200;
        let msg = "";
        const otherData = {};
        if (csv) {
            const path_to_csv = csv.path;
            console.log(path_to_csv);

            doFileMagick(path_to_csv, async (err, parsData) => {
                if (err) {
                    console.log("err:");
                    console.log(err);
                    return;
                }

                // console.log(parsData);

                const catalog = req.body.catalogId;
                console.log(catalog);

                //get list of original and all categories___________
                const allCategories = parsData.map((item) => item.category);
                const originalCategories = [...new Set(allCategories)];
                // console.log(allCategories, originalCategories)

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
                // console.log(vatiants);

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
                            // console.log(insertError.errors.title.path);
                            // // console.log(insertError._message);
                            // console.log(Object.keys(insertError));
                            // console.log(i);
                            // console.log(variants[i]);
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
                // console.log(adedVariants); // MUST BE IDS ARRAYS OR EMPTY ARRAYS
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
                // console.log(products);

                try {
                    const pr = await Product.insertMany(products);
                    console.log("pr:");
                    console.log(pr.length);

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

                    // console.log(addedVariants);
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
                // // console.log(pr)

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
            // console.log(directoryPath);

            let extracting = await extracFile(file_path_zip, pathtoUnload);
            const files = await fs.readdirSync(pathtoUnload);

            let imgToBlob = {};
            // files.forEach(async (img) => {

            // });
            for (let i = 0; i < files.length; i++) {
                const img = files[i];
                const imgBlob = await compressToPng(pathtoUnload + "/" + img);
                sharp.cache({ files: 0 });
                // console.log(imgBlob);
                imgToBlob[img] = imgBlob;
            }

            // const toUpd = await Product.updateMany({ img: { $in: files } });
            // console.log(toUpd);
            // console.log(toUpd.length);

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
            // console.log(files);

            deleteFolderRecursive(pathtoUnload);

            // zip.mv(path + zip.name, async (err) => {
            //     if (err) {
            //         return res.status(500).json(err);
            //     }
            //     let extracting = await extracFile(path + zip.name, path);
            //     console.log(extracting);
            //     if (extracting) {
            //         return res.status(200).json(true);
            //     } else {
            //         return res.status(200).json(false);
            //     }
            // });
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
        console.log(added);
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
    // console.log(this.addOptions);
    const { addOptions } = this;
    // console.log(filePath);

    const options = {
        quality: 70, // Качество изображения (0-100)
        chromaSubsampling: "4:4:4", // Сохранение цветовой информации
        trellisQuantisation: true, // Оптимизация квантования
    };
    try {
        // console.log(filePath);
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

/*
OLD ADD PRODUCT FROM FILE


const path = __dirname + "/../../" + csv.name;
            console.log(path);
            csv.mv(path, (err) => {
                if (err) {
                    return res.status(500).json(err);
                }

                doFileMagick(path, async (err, out) => {
                    console.log(err);
                    deleteFile(path);

                    console.log(out);

                    try {
                        const catalog = req.body.catalogId;
                        console.log(catalog);

                        let allCategories = out.map((item) => item.category);
                        let originalCategories = [];

                        for (let i = 0; i < allCategories.length; i++) {
                            if (
                                !originalCategories.includes(allCategories[i])
                            ) {
                                originalCategories.push(allCategories[i]);
                            }
                        }

                        // GET VARIANTS FOR PRODUCT_______________________________________________________________

                        let vatiants = out.map((item) => {
                            let variantsCount = 0;
                            for (key in item) {
                                if (
                                    key.includes("variant") &&
                                    key.includes("title")
                                ) {
                                    if (item[key].length > 0) {
                                        variantsCount++;
                                    }
                                }
                            }

                            if (variantsCount.length === 0) {
                                return [];
                            } else {
                                variantToReturn = [];
                                for (let i = 1; i <= variantsCount; i++) {
                                    variantToReturn.push({
                                        title: item[`variant_${i}_title`],
                                        quantity: item[`variant_${i}_quantity`],
                                        price: item[`variant_${i}_price`],
                                    });
                                }
                                return variantToReturn;
                            }
                        });

                        //END GET VARIANTS FOR PRODUCT_______________________________________________

                        // ADD VARIANTS _______________________________________________________________
                        let minPrice = vatiants.map((item) => {
                            if (item.length > 0) {
                                return item
                                    .map((variant) => variant.price)
                                    .sort((a, b) => a - b)[0];
                            } else {
                                return null;
                            }
                        });
                        let adedVariants = [];
                        for (let i = 0; i < vatiants.length; i++) {
                            if (vatiants[i].length > 0) {
                                let ids = await Variant.insertMany(vatiants[i]);
                                adedVariants.push(ids.map((id) => id._id));
                            } else {
                                adedVariants.push([]);
                            }
                        }
                        console.log("insert Variants");
                        // console.log(adedVariants); // MUST BE IDS ARRAYS OR EMPTY ARRAYS
                        // END ADD VARIANTS _______________________________________________________________

                        // ADD NEW CATEGORIES_________________________________________________________

                        const mongoCategories = await Category.find({
                            title: { $in: originalCategories },
                        });
                        originalCategories = originalCategories.filter(
                            (category) =>
                                !mongoCategories.find(
                                    (mongoCategory) =>
                                        mongoCategory.title === category
                                )
                        );
                        allCategories = allCategories.map((item) => {
                            let inCat = mongoCategories.find(
                                (mongoCategory) => mongoCategory.title === item
                            );
                            if (inCat && item === inCat.title) {
                                return inCat._id;
                            } else {
                                return item;
                            }
                        });

                        let categoriesToAddToCatalog = [];

                        if (originalCategories.length > 0) {
                            categoriesToAddToCatalog =
                                await Category.insertMany(
                                    originalCategories.map((item) => {
                                        return {
                                            title: item,
                                            catalog: catalog,
                                        };
                                    })
                                );
                            console.log("insert Category");
                            originalCategories = originalCategories.filter(
                                (category) =>
                                    !categoriesToAddToCatalog.find(
                                        (mongoCategory) =>
                                            mongoCategory.title === category
                                    )
                            );
                            allCategories = allCategories.map((item) => {
                                let inCat = categoriesToAddToCatalog.find(
                                    (mongoCategory) =>
                                        mongoCategory.title === item
                                );
                                if (inCat && item === inCat.title) {
                                    return inCat._id;
                                } else {
                                    return item;
                                }
                            });
                        }

                        categoriesToAddToCatalog = categoriesToAddToCatalog.map(
                            (item) => item._id
                        );

                        // console.log(allCategories) // TO INSERT INTO PRODUCTS
                        // console.log(originalCategories)  // MUST BE EMPTY AT THIS POINT
                        // console.log(categoriesToAddToCatalog) // TO INSERT INTO CATALOG (NEW CATEGORIES)

                        // END ADD NEW CATEGORIES_________________________________________________________

                        // MAKE PRODUCTS_______________________________________________________________

                        let products = out.map((item, index) => {
                            return {
                                title: item.title,
                                description: item.description,
                                image: item.image,
                                price:
                                    minPrice[index] === null
                                        ? +item.price
                                        : minPrice[index],
                                quantity: +item.quantity,
                                category: allCategories[index],
                                variants: adedVariants[index],
                            };
                        });

                        // products = pro
                        // console.log(products);

                        const pr = await Product.insertMany(products);
                        // console.log(pr)

                        // END MAKE PRODUCTS_______________________________________________________________

                        // ADD PRODUCTS TO CATEGORIES_______________________________________________________________
                        for (let i = 0; i < pr.length; i++) {
                            await Category.findByIdAndUpdate(allCategories[i], {
                                $push: { products: pr[i]._id },
                            });
                        }
                        // END ADD PRODUCTS TO CATEGORIES_______________________________________________________________
                        let addedProducts = pr.length;
                        let addedVariants = adedVariants.reduce(
                            (acc, curr) => acc + curr.length,
                            0
                        );
                        let addedCategories = categoriesToAddToCatalog.length;
                        // console.log(`Added ${addedProducts} products, ${addedVariants} variants, ${addedCategories} categories`)

                        // ADD CATEGORIES TO CATALOG_______________________________________________________________

                        await Catalog.findByIdAndUpdate(catalog, {
                            $push: {
                                categories: { $each: categoriesToAddToCatalog },
                            },
                        });

                        // END ADD CATEGORIES TO CATALOG_______________________________________________________________

                        //remove file

                        res.status(200).json({
                            status: true,
                            addedProducts,
                            addedVariants,
                            addedCategories,
                        });
                    } catch (err) {
                        console.log("err");
                        console.log(err);
                        switch (err.code) {
                            case 11000:
                                res.status(400).json({
                                    message: "Product already exists",
                                });
                                break;
                            default:
                                res.status(500).json(err);
                                break;
                        }
                    }
                });
            });
*/
