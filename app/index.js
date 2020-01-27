var createError = require('http-errors');
var express = require('express');
const DB = require('./db/connector')

const urlRouter = require('./routes/url');

var config = require('./config');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const mongoose = new DB(config).getConnection_Mongo();

mongoose.Promise = global.Promise

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, Authorization')
    next()
})


app.use('/', urlRouter);

app.use(function (req, res, next) {
    next(createError(404));
});


app.use(function (err, req, res, next){
    res.json(err)
})

module.exports = app;
