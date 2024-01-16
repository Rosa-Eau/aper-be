const express = require('express');
const app = express();;
const bodyParser = require('body-parser');
const path = require ('path')
app.use(bodyParser.json());
// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3001;
const cors = require('cors');
// Routes 
const userRouter = require("./routes/users/user-route");
const storyRouter = require("./routes/stories/story-route");
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://aper.cc');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(cors())
app.use(express.json())

//implementing static path
app.use(express.static(path.join("uploads", '../public')));

require('mongoose')
require('./db/db')


//Route Redirection
app.use('/user',userRouter);
app.use('/story',storyRouter);

app.listen(port)
app.get('/',(req,res)=>{
    res.send("Server is connected")
    
}) 
console.log("server is running on port ", port)


