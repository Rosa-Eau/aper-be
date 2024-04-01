const express = require('express');
const router = express.Router();
const {authenticateToken} = require("../../middlewares/jsonWebToken")
const {addStory, getStory , updateStory , deleteStory, addEpisode,updateEpisode,deleteEpisode,getEpisodeByAuthor,getEpisode , fetchStories, getEpisodeByIdAndStory ,  searchStories,getStoryByStoryId, findRecentAuthorStories , publishStories, publishEpisodes} = require("../../controllers/stories/story-controller")

router.post('/add-story',authenticateToken,addStory);
router.get('/getStory/:authorId',getStory);
router.get('/getStoryByStoryId/:storyId', getStoryByStoryId );
router.get('/getRecentAuthorStories',findRecentAuthorStories);
router.put('/updateStory/:storyId', authenticateToken,updateStory );
router.delete('/deleteStory', authenticateToken ,deleteStory);
router.post('/add-episode', authenticateToken, addEpisode);
router.put('/update-episode/:episodeId',authenticateToken,updateEpisode);
router.delete('/delete-episode',authenticateToken,deleteEpisode);
router.get('/get-episode/:storyId',getEpisode);
router.get('/get-episodeByAuthor/:authorId',getEpisodeByAuthor);
router.get('/get-episodeById/:storyId/:episodeId',getEpisodeByIdAndStory);
router.get('/fetchStories',fetchStories);
router.get('/search/:key?',authenticateToken ,searchStories);
router.post('/publishStories',publishStories);
router.post('/publishEpisodes',publishEpisodes);

module.exports = router
