const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://aper.cc');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Use the cors middleware
app.use(cors());

// Implementing static path
app.use(express.static(path.join("uploads", '../public')));

require('mongoose');
require('./db/db');

// Routes
const userRouter = require('./routes/users/user-route');
const storyRouter = require('./routes/stories/story-route');
app.use('/user', userRouter);
app.use('/story', storyRouter);

app.get('/', (req, res) => {
    res.send('Server is connected');
});

app.listen(port, () => {
    console.log('Server is running on port ', port);
});
