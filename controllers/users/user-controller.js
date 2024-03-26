require('dotenv').config();
const bcrypt = require("bcrypt")
const usersDataAccess = require("../../Data-Access-Layer/users/user-dal")
const imageDataAccess = require("../../Data-Access-Layer/users/image.dal")
const { generateAccessToken } = require("../../middlewares/jsonWebToken")
const AWS = require('aws-sdk');
const storyDataAccess = require("../../Data-Access-Layer/stories/story-dal");
const episodeDataAccess = require("../../Data-Access-Layer/episodes/episode-dal");
//S3 credentials
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: 'SgI7Gz+nNgtNeJFqdBsNYj4qRJ3HbG6qBjqkiViN',
    region: process.env.AWS_REGION,
});

const S3 = new AWS.S3();

//signupUser : this function is to register a new user.
exports.registerUser = async (req, res) => {
    try {
        const { penName, email, password } = req.body;
        if (!penName || !password || !email) {
            res.status(400).json({
                message: 'Invalid request. Please provide penName, email, and password.',
                status: res.statusCode
            });
        }

        const existingUser = await usersDataAccess.getUserByEmail(email);
        if (existingUser) {
            res.status(400).json({
                message: 'Email already exists. Please choose a different email.',
                status: res.statusCode
            });
        }

        const passwordHash = bcrypt.hashSync(req.body.password, 10);
        const data = {
            penName: req.body.penName,
            email: req.body.email,
            password: passwordHash
        };

        const storedUser = await usersDataAccess.storeUser(data);
        if (storedUser) {
            const token = generateAccessToken({ _id: storedUser._id });
            res.json({
                message: "User has been registered successfully",
                data: storedUser,
                auth: token,
                status: res.statusCode
            });
        }

    } catch (err) {
        res.json({
            message: "Something went wrong",
            error: err.message,
            status: res.statusCode
        });
    }
}

//loginUser : this function is for logging-in if the email matches.
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

//updateBackground : this function is to update the background image and saving the file in s3
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
            Bucket: "aper-files",
            Key: req.file.filename,
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

//updateProfileDescription : this function is for updating the profile description.
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

//getUserDetails: this function is for getting the logged-in user details.
exports.getUserDetails = async (req, res) => {
    try {
        let id = req.token_data._id;
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


// deleteMembership: this function will delete the logged-in user details.
exports.deleteMembership = async (req, res) => {
    try {
        let id = req.token_data._id;
            const deleteUser = await usersDataAccess.deleteMembership(id)
            if (deleteUser) {
                await storyDataAccess.deleteStoryByAuthor(id)
                await episodeDataAccess.deleteEpisodeByAuthor(id)
                await 
                res.status(200).json({
                    message: "User Deleted",
                    data: deleteUser
                });
            }
            else {
                res.status(400).json({
                    message: "User Not Deleted",
                });
            }

    } catch (err) {
        res.json({
            message: "Something went wrong",
            error: err.message,
            status: res.statusCode
        })

    }
}

//updateUserDetails: this function will update the logged-in user details including penName, email and password.
exports.updateUserDetails = async (req, res) => {
    try {
        const _id = req.token_data._id;

        const data = {
            penName: req.body.penName,
            email: req.body.email,
            password: req.body.password ? bcrypt.hashSync(req.body.password, 10) : undefined,
        };

        let updateData = {
            _id,
            toUpdate: {},
        };
        // Only include fields with values in the toUpdate object
        if (data.penName) {
            updateData.toUpdate.penName = data.penName;
        }

        if (data.email) {
            updateData.toUpdate.email = data.email;
        }

        if (data.password) {
            updateData.toUpdate.password = data.password;
        }

        const update = usersDataAccess.updateUserDetails(updateData);

        if (update) {
            res.status(200).json({
                message: "User Updated"
            });
        } else {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
            res.status(400).json({                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
                message: "User Not Updated",
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
            error: err.message,
            status: res.statusCode,
        });
    }
};

//verifyPassword : This function will match the password(given in a body) with the logged-in user password.
exports.verifyPassword = async(req,res)=>{
    try {
        let id = req.token_data._id;
        const userData = await usersDataAccess.findUserById(id);
   
        const match = bcrypt.compareSync(req.body.password, userData.password);
        if (match){
            res.status(200).json({
                message: "Password matched"
            });
        }
        else {
            res.json({
                message: "Password not matched"
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
            error: err.message,
            status: res.statusCode,
        });
    }
}

//saveImage: this api is to save the local imagepath to the database.
exports.saveImage = async(req,res)=>{

    try {
        const data = {
            imagePath : req.body.imagePath,
            email : req.body.email
        }
        let Email = data?.email
        let backgroundImage= data?.imagePath
        const updateImage = {
            Email,
            toUpdate: {
                backgroundImage,
            },
        };

        // await S3.putObject({
        //     Bucket: "aper-files",
        //     Key: data.imagePath,
        // }).promise()


        storedData = await imageDataAccess.storeImage(data)
        if (storedData) {
             await usersDataAccess.updateUser(updateImage);
            res.status(200).json({
                message: "Image Path Saved",
                data: storedData
            });

        }

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: 500
        });
    }
}


//getImage: this api is to get the image path from the database.
exports.getImage = async(req,res)=>{
    try {
        const Email = req.params.email;
        const imageData = await imageDataAccess.getImage(Email);
        if (imageData) {
            res.json({
                message: "Image found successfully",
                data: imageData,
                status: res.statusCode
            })
        }
        else {
            res.json({
                message: "Image not found",
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