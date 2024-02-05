const mongoose = require("mongoose")
const moment = require("moment");

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
    routineType : {
        type : String
    },
    coverTitle :{
        type : String
    },
    genre : {
        type : String
    },
    description : {
        type : String

    },
    dateOfPublication: {
        type: String, 
        default: moment().format("YYYY-MM-DD"),
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isPublished: {
        type:Boolean,
        default: false
    }
},
{
timestamps : true,  
})

module.exports = mongoose.model('episode',storySchema)