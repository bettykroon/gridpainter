var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config({path: './secret.env'});
const mongoose =  require("mongoose")

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const url = "mongodb+srv://Mikaela:mikaela90@cluster0.qkpmecu.mongodb.net/?retryWrites=true&w=majority"

async function init(){
    try{
        const options = {useNewUrlParser: true, useUnifiedTopology: true}
        await mongoose.connect(url, options)
        console.log("Connected to the database")
    } catch(error){
        console.error(error)
    }
}

init()

io.on("connection", (socket) => {
    console.log("user connected", socket.id);
    io.emit("id", socket.id);

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });

    socket.on("array", (array) => {
        console.log("array", array);
        io.emit("array", array);
    })

    socket.on("username", (username) => {
        console.log("username", username);
    })

    socket.on("chat msg", (msg) => {
        console.log("msg", msg);
        io.emit("chat msg", msg);
    })

    socket.on("database", (colors) => {
        console.log(colors);
        //Skicka colors till databas
    })
})

module.exports = {app: app, server: server};
