const Order = require("../models/Order");

const router = require("express").Router();
const { verifyUser, verifyAdmin } = require("./verifyToken");

router.post("/newOrder", async (req, res) => {
    // console.log(req.body);
    const order = new Order(req.body);
    try {
        await order.save();
        res.status(201).send(order);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get("/orders", verifyAdmin, async (req, res) => {
    // console.log("aasdasd");
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 }).lean();

        res.status(201).send(orders);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get("/order/:id", verifyAdmin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).lean();
        res.status(201).send(order);
    } catch (err) {
        res.status(200).send({ message: "Order not found" });
    }
});

router.post("/note", verifyAdmin, async (req, res) => {
    const { id, note } = req.body;
    // console.log(note, id);
    try {
        const order = await Order.findById(id);
        if (order.notes) {
            order.notes.push(note);
        } else {
            order.notes = [note];
        }
        // console.log(order)
        await order.save();
        res.status(201).send(order);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.put("/order/:id", verifyAdmin, async (req, res) => {
    // console.log(req.body);
    // console.log(req.params.id);
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
