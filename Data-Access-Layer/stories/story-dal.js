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

//find Story By author id
const findStoryById = async (id) => {
    try {
        const story = await Story.find({ authorId: id });
        return story

    } catch (error) {
        console.log(error)
    }
}
//find Story By story id
const findStoryByStoryId = async (id) => {
    try {
        const story = await Story.findOne({_id :id});
        return story

    } catch (error) {
        console.log(error)
    }
}

//findAllStories 

const findAllStories = async () =>{
    try{
        const story = Story.find();
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

  const findStoriesByFilter = async (filter) => {
    try {
        const stories = await Story.find(filter);
        return stories;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
//searchStory : this function is to search the story based on any fieled based on stories
const searchStory = async (key) => {
    try {
        const data = await Story.find({
            $or: [
                { genre: { $regex: new RegExp(key, 'i') } },
                { authorName: { $regex: new RegExp(key, 'i') } },
                { routineType: { $regex: new RegExp(key, 'i') } },
                { coverTitle: { $regex: new RegExp(key, 'i') } },
                { dateOfPublication: { $regex: new RegExp(key, 'i') } },
            ],
        });
        return data;
    } catch (error) {
        console.log(error);
    }
};


module.exports = { storeStory, findStoryById , updateStory , deleteStory , findStoryWithEpisode, findAllStories ,findStoriesByFilter , searchStory,findStoryByStoryId}