const { deleteFile } = require("../doFileMagick");
const Catalog = require("../models/Catalog");
const Category = require("../models/Category");
const { Product, Variant } = require("../models/Product");

const { verifyUser, verifyAdmin } = require("./verifyToken");


const pathToPublicProducts = __dirname + '/../../../front/public/src/products/';



const router = require("express").Router();


//add category and category to catalog
router.post("/", verifyAdmin, async (req, res) => {
    const category = new Category({
        title: req.body.title,
        catalog: req.body.catalog
    });
    try {
        
        const newCategory = await category.save();
        const catalog = await Catalog.findById(req.body.catalog);
        catalog.categories.push(newCategory._id);
        await catalog.save();
        
        return res.status(201).json(newCategory);
    } catch (err) {
        if (err?.code === 11000) {
            return res.status(400).json("Category already exists");
        }
        return res.status(400).json(err);
    }
} );

//get categories by catalog id
router.get("/", async (req, res) => {
    console.log(req.query.catalog);
        try {
            const categories = await Category.find({
                catalog: req.query.catalog
            }, 'title products').lean();
            res.status(200).json(categories);
        } catch (err) {
            res.status(500).json(err);
        }
});

//get all categorys and find products by category id
router.get("/:product", async (req, res) => {
    const productId = req.params.product;

    try {
        const category = await Category.find({}, 'title products').lean();
        const selectedCategory = category.find(cat => cat.products.toString().includes(productId));
        // console.log(category);
        // console.log('selectedCategory: ', selectedCategory);
        // const allCategory = retrunNeededInfo(category);
        const allCategory = category.map(cat => retrunNeededInfo(cat));
        const sCategory = retrunNeededInfo(selectedCategory) || null;
        
        res.status(200).json({all: allCategory, selected: sCategory});
    } catch (err) {
        res.status(500).json(err);
    }
} );


router.get('/catalog/:id', async(req, res)=>{
    const catalogId = req.params.id;

    try {
        const categories = await Category.find({catalog: catalogId}, 'title').lean();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json(err);
    }
})


//delete category and products by id
router.delete("/:id", verifyAdmin, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id, 'products catalog').lean();

        // console.log(category);x
        // DELETE PRODUCTS THEN DELETE CATEGORY
        const products = await Product.find({_id: {$in: category.products}});
        for (let i = 0; i < products.length; i++) {
            if(products[i].image.length > 0){
                deleteFile(pathToPublicProducts + products[i].image);
            }
            if(products[i].variants.length > 0){
                await Variant.deleteMany({_id: { $in: products[i].variants}});
            }
        }
        await Product.deleteMany({ _id: { $in: category.products } });
        await Catalog.findByIdAndUpdate(category.catalog, {$pull: {categories: category._id}});
        await Category.findByIdAndDelete(req.params.id);
        

        //remove category from catalog


        res.status(200).json(true);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
} );



function retrunNeededInfo(obj){
    const {products, ...rest} = obj;
    
    return  {...rest};
}



module.exports = router;