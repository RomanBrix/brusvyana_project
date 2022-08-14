const Catalog = require("../models/Catalog");
const Category = require("../models/Category");
const { Product } = require("../models/Product");

const { verifyUser, verifyAdmin } = require("./verifyToken");

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


//delete category and products by id
router.delete("/:id", verifyAdmin, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id, 'products').lean();

        // console.log(category);
        // console.log(Product.deleteMany);
        // DELETE PRODUCTS THEN DELETE CATEGORY
        await Product.deleteMany({ _id: { $in: category.products } });
        await Category.findByIdAndDelete(req.params.id);

        res.status(200).json(true);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
} );







module.exports = router;