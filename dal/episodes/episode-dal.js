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

const getEpisodeById = async(id) =>{
    try {
        const foundeEpisode = await Episode.find({authorId : id});
        return foundeEpisode;
        
    } catch (error) {
        console.log(err)
        
    }
}
const deleteEpisode = async (id) => {
    const episode= await Episode.deleteOne({_id : id});
    return episode;
  };

 const deleteEpisodeByAuthorId = async (id)=>{
    const episode= await Episode.deleteOne({authorId : id});
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
module.exports = { saveEpisode,getEpisodeById , deleteEpisode , updateEpisodeById , deleteEpisodeByAuthorId}