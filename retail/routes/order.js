const Order = require("../models/Order");

const router = require("express").Router();

router.post("/newOrder",  async (req, res) => {
    console.log(req.body);
    const order = new Order(req.body);
    try {
        await order.save();
        res.status(201).send(order);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get("/orders",  async (req, res) => {
    try {
        const orders = await Order.find({}).sort({createdAt: -1}).lean();
        
        res.status(201).send(orders);
    } catch (err) {
        res.status(400).send(err);
    }
});


module.exports = router;