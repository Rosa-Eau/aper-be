const express = require('express');
const router = express.Router();
const {authenticateToken} = require("../../middlewares/jsonWebToken")
const {addStory, getStory , updateStory , deleteStory} = require("../../controllers/stories/story-controller")

router.post('/add-story',authenticateToken,addStory);
router.get('/getStory',authenticateToken,getStory);
router.put('/updateStory', authenticateToken,updateStory );
router.delete('/deleteStory', authenticateToken ,deleteStory);

module.exports = router
