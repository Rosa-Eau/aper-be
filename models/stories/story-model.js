const mongoose = require("mongoose")

const storySchema = new mongoose.Schema({
    authorId : {
       type : String
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
    dateOfPublication: {
        type: Date, 
        default: Date.now, 
    },
    authorName :{
        type :String
    },
    episodes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "episode",
    }]

})

module.exports = mongoose.model('storie',storySchema)