var request = require("request");
//"+ process.env.USER_PORT +"
const userUrlServer = "http://localhost:1337/api/verify";
// const userUrlServer = "https://black-work.site:1337/api/verify";



// CHECK USER AUTHENTICATION
const verifyUser = (req, res, next) => {
    // console.log('go check user')

    const authHeader = req.headers.token;
    console.log("authHeader: " + authHeader);

    //set request header
    const options = {
        url: userUrlServer  + '/user',
        method: "GET",
        headers: {
            "token": authHeader
        }
    };
    //send request
    request(options, function (error, response, body) {
        if (error) {
            return res.status(500).json(error);
        }

        const statusCode = response && response.statusCode;
            // console.log(error)
            // console.log(response.statusCode)
            // console.log(body)
            // console.log('end check user')
        switch (statusCode) {
            case 401:
                res.status(401).json(JSON.parse(body))
                break;

            case 403:
                res.status(403).json(JSON.parse(body));
                break;

            case 200:
                next();
                break;

            default:
                res.status(500).json("error");
                break;
        }
    });
  };



  const verifyAdmin = (req, res, next) => {
 

    const authHeader = req.headers.token;

    //set request header
    const options = {
        url: userUrlServer  + '/admin',
        method: "GET",
        rejectUnauthorized: false,
        headers: {
            "token": authHeader
        }
    };
    //send request
    request(options, function (error, response, body) {
        if (error) {
            return res.status(500).json(error);
        }

        const statusCode = response && response.statusCode;
            // console.log(error)
            // console.log(response.statusCode)
            // console.log(body)
            // console.log('end check user')
        switch (statusCode) {
            case 401:
                res.status(401).json(JSON.parse(body))
                break;

            case 403:
                res.status(403).json(JSON.parse(body));
                break;

            case 200:
                next();
                break;

            default:
                res.status(500).json("error");
                break;
        }
    });
  };



  module.exports = {
    verifyUser,
    verifyAdmin
  };
  