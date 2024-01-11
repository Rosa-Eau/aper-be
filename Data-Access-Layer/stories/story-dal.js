const Story = require("../../models/stories/story-model");
const { ObjectId } = require('mongodb');
//Store Story
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

//find Story By Id
const findStoryById = async (id) => {
    try {
        const story = await Story.find({ authorId: id });
        return story

    } catch (error) {
        console.log(error)
    }
}
//findAllStories 

const findAllStories = async () =>{
    try{
        const story = Story.find().populate('episodes')
        return story
    }catch(error){
        console.log(error)
    }
}
const updateStory = async (storyData) => {
    try {
        const story = await Story.findOneAndUpdate(
            { _id: storyData.StoryId },
            { $set: storyData.toUpdate },
            { new: true }
        );
        return story;
    } catch (error) {
        console.log(error)
    }
}

const findStoryWithEpisode = async (id) =>{
    const story = await Story.find().populate('episodes')
    return story;
}
const deleteStory = async (id) => {
    const story = await Story.deleteOne({_id: id});
    return story;
  };
module.exports = { storeStory, findStoryById , updateStory , deleteStory , findStoryWithEpisode, findAllStories}