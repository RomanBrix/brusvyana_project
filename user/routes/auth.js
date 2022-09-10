const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const {
  verifyTokenAndAdmin,
} = require("./verifyToken");


//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    // isAdmin: req.body.isAdmin || false,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//admin add
router.post("/add", verifyTokenAndAdmin, async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    isAdmin: req.body.isAdmin || false,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN


router.post('/login', async (req, res) => {

  // console.log('object');
    try{
      // console.log(req.body)
        const user = await User.findOne(
            {
                username: req.body.login || req.body.username,
            }
        );
        // console.log(user);
        if(!user){
          return res.status(401).json("Wrong User Name");
        }

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );


        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        const inputPassword = req.body.password;
        
        if(originalPassword != inputPassword) {
           return res.status(401).json("Wrong Password");
        }
        const token = jwt.sign(
        {
            id: user._id,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SEC,
            {expiresIn:"1d"}
        );
  
        const { password, ...others } = user._doc;  
        res.status(200).json({...others, token});

    }catch(err){
        res.status(500).json(err);
    }

});



router.post('/admin', async (req, res) => {

  // console.log('object');
    try{
      // console.log(req.body)
        const user = await User.findOne(
            {
                username: req.body.login || req.body.username,
            }
        );
        // console.log(user);
        if(!user){
          return res.status(401).json("Wrong User Name");
        }

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );


        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        const inputPassword = req.body.password;
        
        if(originalPassword != inputPassword) {
           return res.status(401).json("Wrong Password");
        }
        if(!user.isAdmin){
          return res.status(401).json("You are not an admin");
        }
        const token = jwt.sign(
        {
            id: user._id,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SEC,
            {expiresIn:"1d"}
        );
  
        const { password, ...others } = user._doc;  
        res.status(200).json({...others, token});

    }catch(err){
        res.status(500).json(err);
    }

});

module.exports = router;
