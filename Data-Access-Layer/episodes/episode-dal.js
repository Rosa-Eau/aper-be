const Episode = require("../../models/stories/episode-model");

//Store Episode
const saveEpisode = async (episodeToStore) => {
    try {
        console.log(episodeToStore)
        const storedEpisode = await Episode.create(episodeToStore);
        return storedEpisode;
    }
    catch (err) {
        console.log(err)
    }
};

const getEpisodeByIdAndStory = async(authId,id) =>{
    try {
        const foundEpisode = await Episode.find({storyId : authId , _id: id });
        return foundEpisode;
        
    } catch (error) {
        console.log(err)
        
    }
}


const getEpisodeById =  async(Id) =>{
    try {
        const foundEpisode = await Episode.find({storyId : Id  });
        return foundEpisode;
        
    } catch (error) {
        console.log(err)
        
    }
}

const getEpisodeByAuthorId =  async(Id) =>{
    try {
        const foundEpisode = await Episode.find({authorId : Id  });
        return foundEpisode;
        
    } catch (error) {
        console.log(err)
        
    }
}

const deleteEpisode = async (id) => {
    const episode= await Episode.deleteOne({_id : id});
    return episode;
  };

 const deleteEpisodeByStoryId = async (id)=>{
    try {
        
        const episode= await Episode.deleteMany({storyId : id});
        if (episode){
            console.log("deleted the episdoe====>", episode)
    
            return episode;
        }
    } catch (error) {
        return error.message
    }
  
 }
 
const updateEpisodeById = async (storyData) => {
    try {
        const episode = await Episode.findOneAndUpdate(
            { _id: storyData.id },
            { $set: storyData.toUpdate },
            { new: true }
        );
        return episode;
    } catch (error) {
        console.log(error)
    }
}

const findEpisodesByFilter = async (filter) => {
    try {
        const episodes = await Episode.find(filter);
        return episodes;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
module.exports = { saveEpisode,getEpisodeById , deleteEpisode , updateEpisodeById , deleteEpisodeByStoryId , getEpisodeByIdAndStory,getEpisodeByAuthorId, findEpisodesByFilter}