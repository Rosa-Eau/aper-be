// const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose')
require('dotenv').config();
const uri = process.env.database_uri
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
