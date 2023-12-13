const mongoose = require("mongoose")

const storySchema = new mongoose.Schema({
    routineType : {
        type : String
    },
    coverTitle :{
        type : String
    },
    genre : {
        type : String
    },
    styleOfWriting: {
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
    }
    
 
})

module.exports = mongoose.model('storie',storySchema)