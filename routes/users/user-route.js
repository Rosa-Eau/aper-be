const express = require('express');
const router = express.Router()
const {registerUser, loginUser} = require('../../controllers/users/user-controller');

router.post('/sign-up',registerUser);
router.post('/log-in', loginUser);

module.exports = router
