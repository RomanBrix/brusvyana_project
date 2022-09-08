const NovaPochta = require("../models/NovaPochta");

const { verifyAdmin } = require("./verifyToken");



const router = require("express").Router();


router.post("/update", verifyAdmin, async (req, res) => {
    const { cities, warehouses } = req.body;
    console.log("Save nova pochta");
    // console.log(cities.length);
    // console.log(warehouses.length);

    //get novaPoctha from db
    const novaPochta = await NovaPochta.find({});
    if(novaPochta.length > 0){
        await NovaPochta.deleteMany({});
    }

    const newPochta = new NovaPochta({
        cities,
        warehouses
    });

    try{
        const pochta =  await newPochta.save()
        res.status(200).json(true);
    }
    catch(err){
        console.log(err);
    }

} );

router.get("/cities", async (req, res) => {
    const {city, warehouse} = req.query;
    // console.log(req.body)
    // console.log(req.params)
    console.log(warehouse);
    if(city){
        const novaPochta = await NovaPochta.findOne({}, 'cities').lean();

        const filtered = novaPochta.cities.filter((item) => {
            return item.city.toLowerCase().includes(city.toLowerCase());
        });
        
        res.status(200).json(filtered);
    }else if(warehouse){
        // console.log('go load')
        const novaPochta = await NovaPochta.findOne({}, 'warehouses').lean();

        const filtered = novaPochta.warehouses.filter((item) => {
            return item.cityRef === warehouse;
        });
        res.status(200).json(filtered);
    }else{
        const novaPochta = await NovaPochta.findOne({}, 'cities').lean();
        res.status(200).json(novaPochta.cities);
    }
});

router.get("/updTime", verifyAdmin, async (req, res) => {
    const novaPochta = await NovaPochta.find({}, 'updatedAt').lean();
    console.log(novaPochta);
    if(novaPochta.length > 0){
        res.status(200).json({time: novaPochta[0].updatedAt});
    }
    else{
        res.status(200).json({time: null});
    }
});

module.exports = router;