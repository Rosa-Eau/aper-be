const express = require('express');
const router = express.Router();
const {authenticateToken} = require("../../middlewares/jsonWebToken")
const {addStory, getStory , updateStory , deleteStory, addEpisode,updateEpisode,deleteEpisode,getEpisodeByAuthor,getEpisode , fetchStories, getEpisodeByIdAndStory} = require("../../controllers/stories/story-controller")

router.post('/add-story',authenticateToken,addStory);
router.get('/getStory/:authorId',authenticateToken,getStory);
router.put('/updateStory/:storyId', authenticateToken,updateStory );
router.delete('/deleteStory', authenticateToken ,deleteStory);
router.post('/add-episode', authenticateToken, addEpisode);
router.put('/update-episode/:episodeId',authenticateToken,updateEpisode);
router.delete('/delete-episode',authenticateToken,deleteEpisode);
router.get('/get-episode/:storyId',authenticateToken,getEpisode);
router.get('/get-episodeByAuthor/:authorId',authenticateToken,getEpisodeByAuthor);
router.get('/get-episodeById/:storyId/:episodeId',authenticateToken,getEpisodeByIdAndStory);
router.get('/fetchStories',fetchStories);
module.exports = router
