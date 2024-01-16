const storyDataAccess = require("../../Data-Access-Layer/stories/story-dal")
const usersDataAccess = require("../../Data-Access-Layer/users/user-dal")
const episodeDataAccess = require("../../Data-Access-Layer/episodes/episode-dal")

//addStory : this function is to create a story for logged-in user.
exports.addStory = async (req, res) => {
    try {
        const userData = await usersDataAccess.findUserById(req.token_data._id)
        const data = {
            authorId: userData?._id,
            routineType: req.body.routineType,
            coverTitle: req.body.coverTitle,
            genre: req.body.genre,
            lineStyle: req.body.lineStyle,
            dateOfPublication: req.body.dateOfPublication,
            authorName: userData?.penName

        };

        const storedStory = await storyDataAccess.storeStory(data);
        if (storedStory) {
            let Email = userData?.email
            const userToUpdate = {
                Email,
                toUpdate: {
                    authorId : storedStory?.authorId
                },
            };
    
            await usersDataAccess.updateUser(userToUpdate)

            res.json({
                message: "Story has been stored successfully",
                data: storedStory,
                status: res.statusCode
            })

        }

    } catch (err) {
        res.json({
            message: "Something went wrong",
            error: err.message,
            status: res.statusCode
        })

    }
};

//getStory: this function is to get the story with the authorId.
exports.getStory = async (req, res) => {
    try {
        const authorId = req.params.authorId
        let Story = await storyDataAccess.findStoryById(authorId);
        if (Story.length > 0) {
            res.status(200).json({
                message: "Story Found",
                data: Story
            });
        }
        else {
            res.status(404).json({
                message: "No Stories Available"
            })
        }
    }
    catch (err) {
        res.json({
            message: "Something went wrong",
            error: err.message,
            status: res.statusCode
        })

    }
}

//updateStory: this function is to update a story based on storyId that is given in parameter.
exports.updateStory = async (req, res) => {
    try {
        let StoryId = req.params.storyId
        let fieldsToUpdate = req.body
        // Validate fieldsToUpdate
        if (!fieldsToUpdate || Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({
                message: "Fields to update are missing or empty",
                status: 400
            });
        }

        const UpdateStory = {
            StoryId,
            toUpdate: {
                routineType: fieldsToUpdate.routineType,
                coverTitle: fieldsToUpdate.coverTitle,
                genre: fieldsToUpdate.genre,
                lineStyle: fieldsToUpdate.lineStyle,
                dateOfPublication: fieldsToUpdate.dateOfPublication,
                authorName: fieldsToUpdate.authorName
            },
        };

        const update = await storyDataAccess.updateStory(UpdateStory);
        if (update) {

            res.status(200).json({
                message: "Story Updated",
                data: update
            });
        }
        else {
            res.status(404).json({
                message: "Story Can't be Updated because its not available"
            });
        }

    } catch (error) {
        console.error("Error updating story:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: 500
        });
    }
}

//deleteStory: this function is to delete the story based on storyId that is given in the body.
exports.deleteStory = async (req, res) => {
    try {
        let id = req.body.storyId
        const DeleteStory = await storyDataAccess.deleteStory(id);
        await episodeDataAccess.deleteEpisodeByAuthorId(id);        
        res.status(200).json({
            message: "Story deleted",
            data: DeleteStory
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: 500
        });
    }
}

//add episode: this function is to create an episode for logged-in user.
exports.addEpisode = async (req, res) => {
    try {
        const data = {
            authorId: req.token_data._id,
            storyId : req.body.storyId,
            episodeTitle: req.body.episodeTitle,
            description: req.body.description
        }

        storedData = await episodeDataAccess.saveEpisode(data)
        if (storedData) {
            res.status(200).json({
                message: "Episode Saved",
                data: storedData
            });

        }

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: 500
        });
    }
}


// getEpisode: this function is for fetching the episode by storyId
exports.getEpisode = async (req, res) => {
    try {
        const StoryId = req.params.storyId
        const foundEpisode = await episodeDataAccess.getEpisodeById(StoryId)
      
        if (foundEpisode && foundEpisode.length > 0) {
            res.status(200).json({
                message: "Episode Found",
                data: foundEpisode
            });
        } else {
            res.status(404).json({
                message: "No Episode Found",
                status: 404
            });
        }
    
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: 500
        });

    }
}

//getEpisdodeByIdAndAuthor: this function is to get the episode with episodeId and story
exports.getEpisodeByIdAndStory = async(req,res)=>{
    try {
        const StoryId = req.params.storyId
        const id = req.params.episodeId
        const foundEpisode = await episodeDataAccess.getEpisodeByIdAndStory(StoryId,id)
      
        if (foundEpisode && foundEpisode.length > 0) {
            res.status(200).json({
                message: "Episode Found",
                data: foundEpisode
            });
        } else {
            res.status(404).json({
                message: "No Episode Found",
                status: 404
            });
        }
    
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: 500
        });

    }
}

//deleteEpisode: this function is to delete the episode based on episodeId i.e, _id in (episode's collection) .
exports.deleteEpisode = async (req, res) => {
    try {
        let id = req.body.episodeId
        const DeleteEpisode = await episodeDataAccess.deleteEpisode(id);
        res.status(200).json({
            message: "Episode deleted",
            data: DeleteEpisode
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: 500
        });
    }

}

//updateEpisode: this function is to update an episode based on episodeId i.e _id in episodes collection that is given in the parameter.
exports.updateEpisode = async (req, res) => {
    try {
        let id = req.params.episodeId
        let fieldsToUpdate = req.body

        // Validate fieldsToUpdate
        if (!fieldsToUpdate || Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({
                message: "Fields to update are missing or empty",
                status: 400
            });
        }

        const UpdateEpisode = {
            id,
            toUpdate: {
                episodeTitle: fieldsToUpdate.episodeTitle,
                description: fieldsToUpdate.description
            },
        };

        const update = await episodeDataAccess.updateEpisodeById(UpdateEpisode);
        if (update) {

            res.status(200).json({
                message: "Episode Updated",
                data: update
            });
        }
        else {
            res.status(404).json({
                message: "Episode Can't be Updated because its not available"
            });
        }

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: 500
        });
    }
}

//fetch story with episodes

exports.fetchStories = async(req,res)=>{
    try {
        const findStory = await storyDataAccess.findAllStories()
        if (findStory){
            res.status(200).json({
                message: "Data founded",
                data: findStory
            });
        }
        else {
            res.json({
                message: "Data not found"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: 500
        });
    }
}

//getEpiodeByAuthor
exports.getEpisodeByAuthor = async(req,res)=>{
    try {
        const AuthorId = req.params.authorId;
        const foundEpisode = await episodeDataAccess.getEpisodeByAuthorId(AuthorId)
      
        if (foundEpisode && foundEpisode.length > 0) {
            res.status(200).json({
                message: "Episode Found",
                data: foundEpisode
            });
        } else {
            res.status(404).json({
                message: "No Episode Found",
                status: 404
            });
        }
    
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: 500
        });

    }
}