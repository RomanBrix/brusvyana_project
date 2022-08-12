const Category = require("../models/Category");
const {Product, Variant} = require("../models/Product");

const { verifyUser, verifyAdmin } = require("./verifyToken");

const router = require("express").Router();

//get all products
router.get("/", async (req, res) => {
    const globTime = new Date();

    try {
        // const products = await Product.find().populate({path: 'variants', select: ['title', "price", "image", "quantity", "isAvailable"]}).sort({ price: 1 }).lean();
        const products = await Product.find().populate({path: 'variants', select: ['title', "price", "image", "quantity", "isAvailable"]}).sort({ price: 1 }).lean();

        const time = (new Date() - globTime) ;
        console.log(`Time to get all products: ${time} ms`);
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});






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









async function addProduct(product, category) {
    let variantsIds = [];
    let price = product.price;
    let qnty = product.quantity || 0;
    if(product.variants.length > 0) {
        let ids = await Variant.insertMany(product.variants)
        let pr = 0;
        variantsIds = ids.map(variant => {
            pr += variant.price;
            qnty += variant.quantity;
            return variant._id;
        });
        price = Math.round(pr / variantsIds.length);
    }

    const newProduct =  new Product({
        title: product.title,
        description: product.description,
        price,
        variants: variantsIds,
        image: product.image,
        quantity: qnty,
        isAvailable: qnty > 0,
    });

    try{
        let added = await newProduct.save();
        console.log(added)
        const searchedCategory = await Category.findById(category);
        searchedCategory.products.push(added._id);
        await searchedCategory.save();
        return added;
    }catch(err){
        console.log(err);
        return false;
    }
    
}


module.exports = router;