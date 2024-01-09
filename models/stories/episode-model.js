const mongoose = require("mongoose")

const storySchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "storie",
    },
    storyId:{
        type:String
    },
    episodeTitle :{
        type :String
    },

    description : {
        type : String

    }
 
})

module.exports = mongoose.model('episode',storySchema)