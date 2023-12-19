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
            email: req.body.email,
            password: passwordHash
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
            console.log("email and password is required")

        }
        
        const userData = await usersDataAccess.findUserByUsername({
            email: email,
        });
        if (userData){

            const match = bcrypt.compareSync(req.body.password, userData.password);
            if (!match) {
                res.json({
                    message: "Password is incorrect"
                })
            }
            const token = generateAccessToken({ _id: userData._id });
            res.json({
                message: "User Logged in",
                data : userData,
                auth : token,
                status: res.statusCode
            })
        }
        else {
            res.json({
                message: "user not found"
            })
        }
     
    }
    catch (err) {
        res.json({
            message: "Something went wrong",
            error: err.message,
            status: res.statusCode
        })
    }
};



exports.updateBackground = async(req,res) =>{
    try {
        let Email = req.body.email
        let backgroundImage = "uploads/" + req.file.filename;
        const updateImage = {
          Email,
          toUpdate: {
            backgroundImage,
          },
        };
        const updatedProfile = await usersDataAccess.updateUser(updateImage);
      if (updatedProfile){

          res.json({
              message: "Image Uploaded",
              data : updatedProfile,
              status: res.statusCode
          })
      }
      else {
        res.json({
            message: "User not found",
            status: 404
        })
      }
        
    } catch (err) {
        res.json( {
            message: "Something went wrong",
            error : err.message
          });
    }
}


exports.updateProfileDescription = async(req,res) =>{
    try {
        let Email = req.body.email;
        let description = req.body.description;
        const updateDescription = {
          Email,
          toUpdate: {
            description,
          },
        };
        const updatedProfile = await usersDataAccess.updateUser(updateDescription);
      if (updatedProfile){

          res.json({
              message: "Description Updated",
              data : updatedProfile,
              status: res.statusCode
          })
      }
      else {
        res.json({
            message: "User not found",
            status: 404
        })
      }
        
    } catch (err) {
        res.json( {
            message: "Something went wrong",
            error : err.message
          });
    }
}