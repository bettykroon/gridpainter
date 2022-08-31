var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config({path: './secret.env'});

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

const MongoClient = require('mongodb').MongoClient;

const url = process.env.DB_URL;

MongoClient.connect(url, {
    useUnifiedTopology: true
})
.then(client => {
    console.log("UPPKOPPLAD!!!");

    const db = client.db(process.env.DB);
    app.locals.db = db;
})

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

    socket.on("picture", (img) => {
        io.emit("picture", img);
    })
})

module.exports = {app: app, server: server};
