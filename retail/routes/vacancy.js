const Vacancy = require("../models/Vacancy");

const router = require("express").Router();
const { verifyAdmin } = require("./verifyToken");

router.get("/all", async (req, res) => {
    try {
        const vacancys = await Vacancy.find({}).sort({ createdAt: -1 }).lean();
        res.status(200).json(vacancys);
    } catch (err) {
        res.status(500).json(err);
    }
});
router.get("/:id", async (req, res) => {
    console.log(req.query);
    const { id } = req.params;
    try {
        if (!id) throw new Error("xx");
        const vacancy = await Vacancy.findById(id).lean();
        res.status(200).json(vacancy);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post("/new", verifyAdmin, async (req, res) => {
    const vacancy = req.body;
    console.log(vacancy);
    try {
        if (!vacancy) throw new Error("xx");
        const newOne = await Vacancy.create(vacancy);
        console.log(newOne);
        res.status(200).json(newOne);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.delete("/:id", verifyAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) throw new Error("xx");
        await Vacancy.findByIdAndRemove(id);
        res.status(200).json(true);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});
router.put("/:id", verifyAdmin, async (req, res) => {
    // console.log("asdasda");
    const { id } = req.params;
    const { data } = req.body;

    try {
        if (!id || !data) throw new Error("xx");
        const { createdAt, updatedAt, _id, __v, ...sv_data } = data;
        if (id !== _id) throw new Error("xx");
        console.log(sv_data);
        await Vacancy.findByIdAndUpdate(id, sv_data);
        res.status(200).json(true);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;
