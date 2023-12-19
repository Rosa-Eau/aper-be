const mongoose = require("mongoose")

const signUpSchema = new mongoose.Schema({
    penName: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true,
        unique: true  
    },
    password: {
        type: String
    },
    backgroundImage : {
        type : String
    },
    description : {
        type : String
    }
})

module.exports = mongoose.model('User', signUpSchema)