const mongoose = require("mongoose")

const signUpSchema = new mongoose.Schema({
    penName: {
        type: String,
        required: true

    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    backgroundImage : {
        type : String
    }
})

module.exports = mongoose.model('User', signUpSchema)