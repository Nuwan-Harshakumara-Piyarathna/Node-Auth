const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const url = 'mongodb://localhost/auth';

const app = express();

//connect to database
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const con = mongoose.connection;

con.on('open', () => {
    console.log("connected .. ");
});
require("dotenv").config();
app.use(express.json());
app.use(morgan('dev'));
app.use('static', express.static('static'));


//define middlewares
const userRoutes = require('./routes/users');
app.use('/users', userRoutes);

const projectRoutes = require('./routes/projects');
app.use('/projects', projectRoutes);

const authRoutes = require('./routes/auth');
app.use('/auth',authRoutes);

//Error handling
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

//start server in port 9000
app.listen(9000, () => {
    console.log('Server started');
});