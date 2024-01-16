const express = require('express');
const router = express.Router()
const upload = require("../../middlewares/multer");
const {authenticateToken} = require("../../middlewares/jsonWebToken")
const {registerUser, loginUser,updateBackground,updateProfileDescription,getUserDetails, deleteMembership, updateUserDetails, verifyPassword, saveImage, getImage} = require('../../controllers/users/user-controller');

router.post('/sign-up',registerUser);
router.post('/log-in', loginUser);
router.put('/update-Background', upload.single("file"),updateBackground);
router.put('/update-Profle-Description',updateProfileDescription);
router.get('/getUserDetails',authenticateToken,getUserDetails);
router.delete('/deleteMembership',authenticateToken,deleteMembership);
router.put('/updateUserDetails',authenticateToken,updateUserDetails);
router.post('/verifyPassword',authenticateToken,verifyPassword);
router.post('/addImage',saveImage);
router.get('/getImage/:email',getImage);

module.exports = router
