const {
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  } = require("./verifyToken");
  const router = require("express").Router();


  router.get("/user", verifyTokenAndAuthorization, async (req, res) => {
    res.status(200).json(true);
  });

  router.get("/admin", verifyTokenAndAdmin, async (req, res) => {
    res.status(200).json(true);
  });



  module.exports = router;