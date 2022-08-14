const Catalog = require("../models/Catalog");
const Category = require("../models/Category");

const { verifyUser, verifyAdmin } = require("./verifyToken");

const router = require("express").Router();




//Get all catalogs
router.get("/", async (req, res) => {
    // console.log('get all catalogs');

    try {
        const catalogs = await Catalog.find({},'title').lean();
        res.status(200).json(catalogs);
    } catch (err) {
        res.status(500).json(err);
    }
  });

  //get populet categories
    router.get("/:id/categories", async (req, res) => {

        try {
            const catalogs = await Catalog.findById(req.params.id,'categories').populate({path: 'categories', select: 'title products'}).lean();
            res.status(200).json(catalogs);
        } catch (err) {
            res.status(500).json(err);
        }
    })

  //Get catalog by id
    router.get("/:id", async (req, res) => {
        try {
            const catalog = await Catalog.findById(req.params.id).populate('categories');
            res.status(200).json(catalog);
        } catch (err) {
            res.status(500).json(err);
        }    
    });

    //Create catalog
    router.post("/", verifyAdmin, async (req, res) => {
        console.log(req.body.title)
        const catalog = new Catalog({
            title: req.body.title
        });
        try {
            const newCatalog = await catalog.save();
            // console.log(newCatalog);
            return res.status(201).json(newCatalog);
        } catch (err) {
            if(err?.code === 11000) {
                return res.status(400).json("Catalog already exists");
            }
            return res.status(400).json(err);
        }
    } );


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
    } );


    //delete catalog
    router.delete("/:id", verifyAdmin, async (req, res) => {
        try {
            const category = await Category.find({'catalog' : {$in: req.params.id}}, 'products').lean();
            //get length of all products
            const productsLength = category.reduce((acc, curr) => {
                return acc + curr.products.length;
            }, 0);

            if(productsLength > 0){
                return res.status(400).json("Catalog has products");
            }else{
                //delete category
                console.log(Category)
                await Category.deleteMany({'catalog' : {$in: req.params.id}});
                await Catalog.findByIdAndDelete(req.params.id);
                return res.status(200).json(true);
            }
            // const catalog = await Catalog.findByIdAndDelete(req.params.id).lean();
            
        } catch (err) {
            res.status(500).json(err);
        }
    } );




  module.exports = router;