const express = require('express');
const router = express.Router()
const {registerUser, loginUser,updateBackground} = require('../../controllers/users/user-controller');

router.post('/sign-up',registerUser);
router.post('/log-in', loginUser);
router.put('/update-Background',updateBackground)

module.exports = router
