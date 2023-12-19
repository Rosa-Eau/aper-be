const express = require('express');
const router = express.Router()
const upload = require("../../middlewares/multer");
const {authenticateToken} = require("../../middlewares/jsonWebToken")
const {registerUser, loginUser,updateBackground,updateProfileDescription,getUserDetails} = require('../../controllers/users/user-controller');

router.post('/sign-up',registerUser);
router.post('/log-in', loginUser);
router.put('/update-Background', upload.single("file"),updateBackground);
router.put('/update-Profle-Description',updateProfileDescription);
router.get('/getUserDetails',authenticateToken,getUserDetails);

module.exports = router
