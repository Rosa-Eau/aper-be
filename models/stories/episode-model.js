const mongoose = require("mongoose")

const storySchema = new mongoose.Schema({
    authorId : {
        type : String,
        ref : "storie"
    },
    episodeTitle :{
        type :String
    },

    description : {
        type : String

    }
 
})

module.exports = mongoose.model('episode',storySchema)