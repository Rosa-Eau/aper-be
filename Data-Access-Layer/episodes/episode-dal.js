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

const deleteEpisode = async (id) => {
    const episode= await Episode.deleteOne({_id : id});
    return episode;
  };

 const deleteEpisodeByAuthorId = async (id)=>{
    const episode= await Episode.deleteOne({storyId : id});
    return episode;
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
module.exports = { saveEpisode,getEpisodeById , deleteEpisode , updateEpisodeById , deleteEpisodeByAuthorId , getEpisodeByIdAndStory}