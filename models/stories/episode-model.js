const mongoose = require("mongoose")

const storySchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "storie",
    },
    storyId:{
        type: mongoose.Schema.Types.ObjectId,
    },
    episodeTitle :{
        type :String
    },

    description : {
        type : String

    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
 
},
{
timestamps : true,  
})

module.exports = mongoose.model('episode',storySchema)