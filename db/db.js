// const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose')
const uri = "mongodb+srv://apercreatorclub:apercreator@cluster0.pfvujjo.mongodb.net/?retryWrites=true&w=majority";

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
