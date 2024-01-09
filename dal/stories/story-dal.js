const Story = require("../../models/stories/story-model");

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
        const story = Story.find
    }catch(error){
        console.log(error)
    }
}
const updateStory = async (storyData) => {
    try {
        const story = await Story.findOneAndUpdate(
            { _id: storyData.storyId },
            { $set: storyData.toUpdate },
            { new: true }
        );
        return story;
    } catch (error) {
        console.log(error)
    }
}


const deleteStory = async (id) => {
    const story = await Story.deleteOne({_id: id});
    return story;
  };
module.exports = { storeStory, findStoryById , updateStory , deleteStory }