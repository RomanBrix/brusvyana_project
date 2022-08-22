const {doFileMagick, deleteFile, extracFile} = require("../doFileMagick");
const Category = require("../models/Category");
const Catalog = require("../models/Catalog");
const {Product, Variant} = require("../models/Product");



const pathToPublicProducts = __dirname + '/../../../front/public/src/products/';

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

        if(product.variants.length > 0) {
            await Variant.deleteMany({_id: {$in: product.variants}});
        }
        const imgName = product.image;
        deleteFile(pathToPublicProducts + imgName);
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




router.post("/new", verifyAdmin, async (req, res) => {
   
    const  { image } = req.files;
    let  { product }  = req.body;
    console.log()
    if(image){
        product = JSON.parse(product);
    if (!(/^image/.test(image.mimetype))) return res.sendStatus(400);
        image.mv(pathToPublicProducts + image.name);
        product.image = image.name;
    }

    console.log(product)
    const prod = await addProduct(product)
    
    
    res.status(200).json(prod);
});




// LOAD CSV AND ADD DATA
router.post('/fileMagick/:catalogId', verifyAdmin, async (req, res) => {
    console.log(req.files);
    const  { csv } = req.files;
    if( csv ){
        const path = __dirname + '/' + csv.name;
        csv.mv(path,(err)=>{
            if(err) { return res.status(500).json(err)}



            doFileMagick(path, async (err, out)=>{
                // console.log(out)
                deleteFile(path);
        
        
                try{
                const catalog = req.params.catalogId;
                console.log(catalog)
        
        
                let allCategories = out.map((item)=> item.category)
                let originalCategories = []
        
        
        
                for (let i = 0; i < allCategories.length; i++) {
                    if(!(originalCategories.includes(allCategories[i])) ){
                        originalCategories.push(allCategories[i])
                    }
                }
        
                // GET VARIANTS FOR PRODUCT_______________________________________________________________
        
                let vatiants = out.map((item)=> {
                    let variantsCount = 0
                    for (key in item){
                        
        
                        if(key.includes('variant') && key.includes('title')){
                            
                            if(item[key].length > 0){
                                variantsCount++
                            }
                        }
                    }
                    
                    if(variantsCount.length === 0){
                        return []
                    }else{
                        variantToReturn = [];
                        for(let i = 1; i <= variantsCount; i++){
                            variantToReturn.push({
                                title: item[`variant_${i}_title`],
                                quantity: item[`variant_${i}_quantity`],
                                price: item[`variant_${i}_price`]
                            })
                        }
                        return variantToReturn;
                    }
                    
                })
        
                //END GET VARIANTS FOR PRODUCT_______________________________________________
                
        
        
                
                // ADD VARIANTS _______________________________________________________________
        
                let adedVariants = [];
                for(let i = 0; i < vatiants.length; i++){
                    if(vatiants[i].length > 0){
                        let ids = await Variant.insertMany(vatiants[i]);
                        adedVariants.push(ids.map(id => id._id))
                    }else{
                        adedVariants.push([])
                    }
                }
                console.log('insert Variants')
                // console.log(adedVariants); // MUST BE IDS ARRAYS OR EMPTY ARRAYS
                // END ADD VARIANTS _______________________________________________________________
        
                // ADD NEW CATEGORIES_________________________________________________________
        
        
                const mongoCategories = await Category.find({title: {$in: originalCategories}});
                originalCategories = originalCategories.filter(category => !mongoCategories.find(mongoCategory => mongoCategory.title === category))
                allCategories = allCategories.map(item =>{
                    let inCat = mongoCategories.find(mongoCategory => mongoCategory.title === item)
                    if( inCat && item === inCat.title){
                        return inCat._id
                    }else{
                        return item
                    }
                })
        
                let categoriesToAddToCatalog = [];
        
        
                if(originalCategories.length > 0){
                    categoriesToAddToCatalog = await Category.insertMany(originalCategories.map(item => {return {title: item, catalog: catalog}}));
                    console.log('insert Category')
                    originalCategories = originalCategories.filter(category => !categoriesToAddToCatalog.find(mongoCategory => mongoCategory.title === category))
                    allCategories = allCategories.map(item =>{
                        let inCat = categoriesToAddToCatalog.find(mongoCategory => mongoCategory.title === item)
                        if( inCat && item === inCat.title){
                            return inCat._id
                        }else{
                            return item
                        }
                    })
                }
        
                categoriesToAddToCatalog = categoriesToAddToCatalog.map(item => item._id);
        
        
                // console.log(allCategories) // TO INSERT INTO PRODUCTS
                // console.log(originalCategories)  // MUST BE EMPTY AT THIS POINT
                // console.log(categoriesToAddToCatalog) // TO INSERT INTO CATALOG (NEW CATEGORIES)
        
                // END ADD NEW CATEGORIES_________________________________________________________
        
        
                // MAKE PRODUCTS_______________________________________________________________
        
                const products = out.map((item, index)=> {
                    return {
                        title: item.title,
                        description: item.description,
                        image: item.image,
                        price: +item.price,
                        quantity: +item.quantity,
                        category: allCategories[index],
                        variants: adedVariants[index]
                    }
                })
                // console.log(products);
        
                const pr = await Product.insertMany(products);
                // console.log(pr)
        
                // END MAKE PRODUCTS_______________________________________________________________
        
                // ADD PRODUCTS TO CATEGORIES_______________________________________________________________
                    for(let i = 0; i < pr.length; i++){
                        await Category.findByIdAndUpdate(allCategories[i], {$push: {products: pr[i]._id}});
                    }
                // END ADD PRODUCTS TO CATEGORIES_______________________________________________________________
                let addedProducts = pr.length;
                let addedVariants = adedVariants.reduce((acc, curr)=> acc + curr.length, 0);
                let addedCategories = categoriesToAddToCatalog.length;
                // console.log(`Added ${addedProducts} products, ${addedVariants} variants, ${addedCategories} categories`)
                
                // ADD CATEGORIES TO CATALOG_______________________________________________________________
                
                await Catalog.findByIdAndUpdate(catalog, {$push: {categories: {$each: categoriesToAddToCatalog}}});
        
                // END ADD CATEGORIES TO CATALOG_______________________________________________________________
        
                //remove file
                
                
                res.status(200).json({status: true, addedProducts, addedVariants, addedCategories});
            }catch(err){
                console.log('err')
                console.log(err)
                switch(err.code){
                    case 11000:
                        res.status(400).json({message: 'Product already exists'});
                        break;
                    default:
                        res.status(500).json(err);
                        break;
                }
            }
                
            })

        });
    }else{
        return res.status(400).json({msg: "No file"});
    }
})





// LOAD ZIP OF IMGS
router.post('/productMagick', verifyUser, async (req, res)=>{
    // console.log(req.files);
    const  { zip } = req.files;

    // front/public/src/prdoucts/
    if( zip ){
        const path = pathToPublicProducts;
        console.log(path);
        zip.mv(path + zip.name,async (err)=>{
            if(err) { return res.status(500).json(err)}
            let extracting = await extracFile(path + zip.name, path);
            console.log(extracting);
            if(extracting){
                return res.status(200).json(true);
            }else{
                return res.status(200).json(false);
            }
        })
    }
    


})


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





async function addProduct(product) {
    let variantsIds = [];
    let price = product.price;
    let qnty = product.quantity || 1;
    if(product?.variants && product?.variants.length > 0) {
        let ids = await Variant.insertMany(product.variants)
        let pr = ids[0].price;
        variantsIds = ids.map(variant => {
            if(pr > variant.price) {
                price = pr;
            }
            qnty += variant.quantity;
            return variant._id;
        });
    }

    const newProduct =  new Product({
        title: product.title,
        description: product.description,
        price,
        variants: variantsIds,
        image: product.image,
        quantity: qnty,
        category: product.category,
        isAvailable: qnty > 0,
    });

    try{
        let added = await newProduct.save();
        console.log(added)
        const searchedCategory = await Category.findById(product.category);
        searchedCategory.products.push(added._id);
        await searchedCategory.save();
        return added;
    }catch(err){
        console.log(err);
        return false;
    }
    
}





module.exports = router;