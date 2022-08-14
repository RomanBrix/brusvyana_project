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

router.get("/ids", async (req, res) => {
    console.log("req.query.ids: " + req.query.ids);
    // console.log(req.query.ids)
    try {
        const products = await Product.find({ '_id': { $in: req.query.ids } }, 'title description price image quantity isAvailable').sort({ createdAt: -1 }).lean();

        res.status(200).json(products);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})
//get product by id
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate({path: 'variants', select: ['title', "price", "image", "quantity", "isAvailable"]}).lean();
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
} );

//delete product
router.delete("/:id", verifyAdmin, async (req, res) => {
    const id = req.params.id;
    try {
        const category = await Category.find({'products' : {$in: [id]}}, 'products').lean();
        
        if(category.length > 0) {
            category.forEach(async (cat) => {
                cat.products = cat.products.filter(product => product != id);

                await Category.findByIdAndUpdate(cat._id, cat);
            });
        }


        
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({msg: "Product not found"});
        }
        await product.remove();
        res.status(200).json(true);
    }
    catch (err) {
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
    if(product?.variants && product?.variants.length > 0) {
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