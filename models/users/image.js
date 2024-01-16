const mongoose = require("mongoose")

const imageSchema = new mongoose.Schema({
  imagePath : {
    type:String
  },
  email : {
    type:String,
    ref: "User"
  }
})

module.exports = mongoose.model('Image', imageSchema)