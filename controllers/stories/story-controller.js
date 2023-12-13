const storyDataAccess = require("../../dal/stories/story-dal")
exports.addStory = async (req, res) => {
    try {
        const data = {
            routineType: req.body.routineType,
            coverTitle: req.body.coverTitle,
            genre: req.body.genre,
            styleOfWriting: req.body.styleOfWriting,
            description: req.body.description,
            dateOfPublication: req.body.dateOfPublication,
            authorName: req.body.authorName

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
