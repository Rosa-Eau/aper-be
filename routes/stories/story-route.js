const express = require('express');
const router = express.Router();
const {authenticateToken} = require("../../middlewares/jsonWebToken")
const {addStory, getStory , updateStory , deleteStory, addEpisode} = require("../../controllers/stories/story-controller")

router.post('/add-story',authenticateToken,addStory);
router.get('/getStory',authenticateToken,getStory);
router.put('/updateStory/:authorId', authenticateToken,updateStory );
router.delete('/deleteStory', authenticateToken ,deleteStory);
router.post('/addEpisode', authenticateToken, addEpisode);
module.exports = router
