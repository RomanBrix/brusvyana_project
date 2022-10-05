const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");


const fs = require('fs')
const https = require('https');

const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const verify = require("./routes/verify");

dotenv.config();
const PORT = process.env.USER_PORT || 5000;

mongoose
  .connect(process.env.USER_MONGO_URL)
  .then(() => console.log("DB [USER] Connected!"))
  .catch((err) => {
    console.log(err);
  });


app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);

app.use("/api/verify", verify);



if(process.env.DEVELOP === 'develop'){
  app.listen(PORT, () => {
    console.log("Backend server is running! port:  " + PORT);
});
}
else{
  // console.log('HELLO')
  // console.log(PORT)
  // console.log(process.env.USER_MONGO_URL)
  var privateKey = fs.readFileSync( '../cert/key.pem' );
  var certificate = fs.readFileSync( '../cert/cert.pem' );

  https.createServer({
      key: privateKey,
      cert: certificate
  }, app).listen(PORT);
}