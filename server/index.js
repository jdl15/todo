const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const userRoutes = require('./routes/user'); // import user routes
const taskRoutes = require('./routes/task'); // import task routes

app.use(cors());
app.use(express.json());
// load the environment variables
require('dotenv').config();
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Hello, Todo List!');
});
app.use('/user', userRoutes); // use user routes
app.use('/tasks', taskRoutes); // use task routes


app.listen(port,() =>{
    console.log(`Server is running on port ${port}`);
})