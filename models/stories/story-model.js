const mongoose = require("mongoose")
const moment = require("moment");
const storySchema = new mongoose.Schema({
    authorId : {
        type: mongoose.Schema.Types.ObjectId,
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
        type: String, 
        default: moment().format("YYYY-MM-DD"),
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