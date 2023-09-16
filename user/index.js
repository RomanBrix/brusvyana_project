const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");

function useUser(app) {
    app.get("/", (req, res) => {
        res.send("Слава Україні!");
    });
    app.use("/user/auth", authRoute);
    app.use("/user/users", userRoute);

    // app.use("/api/verify", verify);
}
module.exports = useUser;
