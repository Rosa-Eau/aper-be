const bcrypt = require("bcrypt")
const usersDataAccess = require("../../dal/users/user-dal")
const { generateAccessToken } = require("../../middlewares/jsonWebToken")

exports.registerUser = async (req, res) => {

    try {
        const { penName, email, password } = req.body;
        if (!penName, !password || !email) {
            console.log('err')
        }
        const passwordHash = bcrypt.hashSync(req.body.password, 10);
        const data = {
            penName: req.body.penName,
            email: req.body.email.toLowerCase(),
            password: passwordHash,
            backgroundImage : req.body.backgroundImage
        };

        const storedUser = await usersDataAccess.storeUser(data);
        if (storedUser) {
            res.json({
                message: "User has been registered successfully",
                data: storedUser,
                status: res.statusCode
            })

        }

    } catch (err) {
        res.json({
            message: "Something went wrong",
            error: err, message,
            status: res.statusCode
        })
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            console.log("nothing")

        }
        const userData = await usersDataAccess.findUserByUsername({
            email: req.body.email.toLowerCase(),
        });
        if (!userData) {
            res.json({
                message: "Invalid User",
                status: res.statusCode
            })
        }
        const match = bcrypt.compareSync(req.body.password, userData.password);
        if (!match) {
            res.json({
                message: "Password is incorrect"
            })
        }
        const token = generateAccessToken({ _id: userData._id });
        res.json({
            message: "User Logged in",
            token,
            status: res.statusCode
        })
    }
    catch (err) {
        res.json({
            message: "Something went wrong",
            error: err.message,
            status: res.statusCode
        })
    }
};
