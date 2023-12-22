const storyDataAccess = require("../../dal/stories/story-dal")
const usersDataAccess = require("../../dal/users/user-dal")

// create a story
exports.addStory = async (req, res) => {
    try {

        const userData = await usersDataAccess.findUserById(req.token_data._id)
        const data = {
            authorId: userData._id,
            routineType: req.body.routineType,
            coverTitle: req.body.coverTitle,
            genre: req.body.genre,
            lineStyle: req.body.lineStyle,
            description: req.body.description,
            dateOfPublication: req.body.dateOfPublication,
            authorName: userData?.penName,
            episodeTitle: req.body.episodeTitle

        };

        const storedStory = await storyDataAccess.storeStory(data);
        if (storedStory) {
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

//get Story
exports.getStory = async (req, res) => {
    try {
        let Story = await storyDataAccess.findStoryById(req.token_data._id);
         if (Story.length>0){
            res.status(200).json({
                message: "Story Found",
                data: Story
            });
        }
        else {
            res.status(404).json({
                message : "No Stories Available"
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

exports.updateStory = async (req, res) => {
    try {
        let authorId = req.token_data._id
        let fieldsToUpdate = req.body

        // Validate fieldsToUpdate
        if (!fieldsToUpdate || Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({
                message: "Fields to update are missing or empty",
                status: 400
            });
        }

        const UpdateStory = {
            authorId,
            toUpdate: {
                routineType : fieldsToUpdate.routineType,
                coverTitle : fieldsToUpdate.coverTitle,
                genre : fieldsToUpdate.genre,
                lineStyle : fieldsToUpdate.lineStyle,
                description : fieldsToUpdate.description,
                dateOfPublication : fieldsToUpdate.dateOfPublication,
                authorName : fieldsToUpdate.authorName,
                episodeTitle : fieldsToUpdate.episodeTitle  
            },
        };

        const update = await storyDataAccess.updateStory(UpdateStory);
        if (update){

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

exports.deleteStory = async(req,res)=>{
    try {
        let id = req.token_data._id
        const DeleteStory = await storyDataAccess.deleteStory(id);
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