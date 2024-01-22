const mongoose = require("mongoose")
const moment = require("moment");
const { Timestamp } = require("mongodb");
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
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isPublished : {
        type: Boolean,
        default : false
    }

}, {
    timestamps : true
})

module.exports = mongoose.model('storie',storySchema)