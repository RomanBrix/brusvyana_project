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


//update product
router.put("/:id", verifyAdmin, async (req, res) => {
    const productId = req.params.id;
    const categoryId = req.body.category;
    const {product} = req.body;
    // console.log(product)
    const {variants} = product;
    const variantsToDelete = variants.filter(variant => variant.flag === 'delete').map(variant => { delete variant.flag; return variant; });
    const variantsToUpdate = variants.filter(variant => variant.flag === 'update').map(variant => { delete variant.flag; return variant; });
    const variantsToAdd    = variants.filter(variant => variant.flag === 'add').map(variant => {
        delete variant.flag;
        variant.quantity = +variant.quantity;
        variant.price = +variant.price;
        variant.isAvailable = variant.quantity > 0;
        if(!variant.image) {
            return {
                ...variant,
                image: product.image
            }
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
    }

    // console.log('variantsToDelete', variantsToDelete);
    // console.log('variantsToUpdate', variantsToUpdate);
    // console.log('variantsToAdd', variantsToAdd);
    console.log('mainProduct', mainProduct);
    if(variantsToDelete.length > 0) {
        deleteVariantsPerUpdate(variantsToDelete);

    }
    if(variantsToUpdate.length > 0) {
        updateVariantsPerUpdate(variantsToUpdate)

    }

    
    let variantsToDeleteIds = [];

    if(variantsToAdd.length > 0) {

        const newIds = await addVariantsPerUpdate(variantsToAdd);
        
        if(variantsToDelete.length > 0){
            variantsToDeleteIds = variantsToDelete.map(variant => variant._id);
        }
        await Product.findByIdAndUpdate(productId, {$set: mainProduct, $push: {variants: {$each: newIds}}});
        

    }else{

        if(variantsToDelete.length > 0){
            variantsToDeleteIds = variantsToDelete.map(variant => variant._id);
        }
        await Product.findByIdAndUpdate(productId, {$set: mainProduct});
        
        

        
    }
    
    if(variantsToDelete.length > 0){
       await Product.updateMany({'variants': {$in: variantsToDeleteIds}}, {$pull: {variants: {$in: variantsToDeleteIds}}});
    }

    if(categoryId) {
        await Category.findOneAndUpdate({'products': productId}, {$pull: {products: productId}});
        await Category.findByIdAndUpdate(categoryId, {$push: {products: productId}});
    }

    
    // console.log(ok)
    res.status(200).json(true)
})
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



async function deleteVariantsPerUpdate(products) {
    await Variant.deleteMany({_id: {$in: products}});
}
async function updateVariantsPerUpdate(products) {
    for(let i = 0; i < products.length; i++) {
        await Variant.findByIdAndUpdate(products[i]._id, {$set: products[i]});
    }
    return true;
    // return await Variant.updateMany({_id: {$in: products}}, {$set: products});
}
async function addVariantsPerUpdate (products) {
    const newVariants = await Variant.insertMany(products);
    const ids = newVariants.map(variant => variant._id);
    return ids
}





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