const Story = require("../../models/stories/story-model");

const storeStory = async (storyToStore) => {
    try {
        console.log(storyToStore)
        const storedStory = await Story.create(storyToStore);
        return storedStory;
    }
    catch (err) {
        console.log(err)
    }
};

module.exports ={storeStory}