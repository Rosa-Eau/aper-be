const express = require('express');
const router = express.Router();
const {authenticateToken} = require("../../middlewares/jsonWebToken")
const {addStory, getStory , updateStory , deleteStory, addEpisode,updateEpisode,deleteEpisode,getEpisode} = require("../../controllers/stories/story-controller")

router.post('/add-story',authenticateToken,addStory);
router.get('/getStory/:authorId',authenticateToken,getStory);
router.put('/updateStory/:authorId', authenticateToken,updateStory );
router.delete('/deleteStory', authenticateToken ,deleteStory);
router.post('/add-episode', authenticateToken, addEpisode);
router.put('/update-episode/:id',authenticateToken,updateEpisode);
router.delete('/delete-episode',authenticateToken,deleteEpisode);
router.get('/get-episode/:authorId/:id',authenticateToken,getEpisode);

module.exports = router
