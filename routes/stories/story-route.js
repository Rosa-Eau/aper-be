const express = require('express');
const router = express.Router();
const {authenticateToken} = require("../../middlewares/jsonWebToken")
const {addStory} = require("../../controllers/stories/story-controller")

router.post('/add-story',authenticateToken,addStory);

module.exports = router
