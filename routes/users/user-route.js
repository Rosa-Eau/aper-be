const express = require('express');
const router = express.Router()
const upload = require("../../middlewares/multer");
const {registerUser, loginUser,updateBackground} = require('../../controllers/users/user-controller');

router.post('/sign-up',registerUser);
router.post('/log-in', loginUser);
router.put('/update-Background', upload.single("file"),updateBackground)

module.exports = router
