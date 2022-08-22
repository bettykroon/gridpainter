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

const { MongoClient } = require('mongodb');

const url = "mongodb+srv://bettykroon:Hjhbkjtmdba13!@cluster0.ghy7r.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(url);

async function run(){
    try {
        console.log("hej");
        const database = client.db('cluster0');
        const collection = database.collection("colors");
    } finally {
        await client.close();
    }
}
run().catch(console.dir)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
        const database = client.db('cluster0');
        const collection = database.collection("colors");
        collection.insertOne({
            array: colors
        })
        .then(result => {
            result.json(result);
        })
    })
})

module.exports = {app: app, server: server};
