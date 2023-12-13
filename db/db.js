// const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose')
const uri = "mongodb+srv://xyz:abc@mycluster.cb7ytsf.mongodb.net/?retryWrites=true&w=majority";

const mongoConnection = ()=>{
  const connection = mongoose.connect(uri)
  if(connection){
    console.log("Db has been connected")
  }
  else {
    console.log("Nope db is not connected")
  }
}
mongoConnection()

module.exports = {mongoConnection}
