const express = require('express');
const app = express();;
const port = 3001;
const cors = require('cors');
// Routes 
const userRouter = require("./routes/users/user-route");
const storyRouter = require("./routes/stories/story-route");
app.use(express.json())
require('mongoose')
require('./db/db')


//Route Redirection
app.use('/user',userRouter);
app.use('/story',storyRouter);

app.use(cors())
app.listen(port)
app.get('/',(req,res)=>{
    res.send("Server is connected")
    
}) 
console.log("server is running on port ", port)


