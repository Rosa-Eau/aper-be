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


module.exports = { saveEpisode }