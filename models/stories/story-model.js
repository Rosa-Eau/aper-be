const mongoose = require("mongoose")

const storySchema = new mongoose.Schema({
    authorId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    routineType : {
        type : String
    },
    coverTitle :{
        type : String
    },
    genre : {
        type : String
    },
    lineStyle: {
        type : String
    },
    description : {
        type : String

    },
    dateOfPublication: {
        type: Date, 
        default: Date.now, 
    },
    authorName :{
        type :String
    },
    episodeTitle :{
        type :String
    }
    
 
})

module.exports = mongoose.model('storie',storySchema)