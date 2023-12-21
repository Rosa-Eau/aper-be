require('dotenv').config();
const bcrypt = require("bcrypt")
const usersDataAccess = require("../../dal/users/user-dal")
const { generateAccessToken } = require("../../middlewares/jsonWebToken")
const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: 'fUdFLrZP1jssvp4zI/Toig4JxRR2SIFvAoGcZJrN',
    region: process.env.AWS_REGION, 
  });
  
const S3 = new AWS.S3();


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
            error: err.message,
            status: res.statusCode
        })
    }
}

exports.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
     
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required fields." });
      }
 
      const userData = await usersDataAccess.findUserByUsername({ email: email });
 
      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }
 
      const match = bcrypt.compareSync(req.body.password, userData.password);
 
      if (!match) {
        return res.status(401).json({ message: "Password is incorrect" });
      }
 
      const token = generateAccessToken({ _id: userData._id });
 
      res.status(200).json({
        message: "User Logged in",
        data: userData,
        auth: token,
      });
    } catch (err) {
      console.error("Error during login:", err);
      res.status(500).json({ message: "An unexpected error occurred. Please try again." });
    }
  };
 


exports.updateBackground = async (req, res) => {
    try {
        let Email = req.body.email
        let backgroundImage = "uploads/" + req.file.filename;
        const updateImage = {
            Email,
            toUpdate: {
                backgroundImage,
            },
        };

        await S3.putObject({
            Bucket :"aper-files",
            Key : req.file.filename,
        }).promise()
        const updatedProfile = await usersDataAccess.updateUser(updateImage);
        if (updatedProfile) {

            res.json({
                message: "Image uploaded",
                data: updatedProfile,
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
        res.json({
            message: "Something went wrong",
            error: err.message
        });
    }
}


exports.updateProfileDescription = async (req, res) => {
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
        if (updatedProfile) {

            res.json({
                message: "Description Updated",
                data: updatedProfile,
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
        res.json({
            message: "Something went wrong",
            error: err.message
        });
    }
}

exports.getUserDetails = async (req, res) => {
    try {
        let id = req.token_data._id ;
        const userData = await usersDataAccess.findUserById(id);
        if (userData) {
            res.json({
                message: "User found successfully",
                data: userData,
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
        res.json({
            message: "Something went wrong",
            error: err.message,
            status: res.statusCode
        })
    }
}

