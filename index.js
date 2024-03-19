const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const app = express();
const route = require("./routes/routes");
const bodyparser = require("body-parser");
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(http, { debug: true });
const {startlive } = require("./controllers/livestream/stream");

app.use(express.json());
app.use("/",route);
app.use(express.static('public'));
app.use('/peerjs', peerServer);

app.listen(3000,()=>{

    console.log("Local Host:3000");

    try {
        mongoose.connect(process.env.DB,
            {

            });

        console.log("Database connected");
        startlive;

    } catch (error) {
        console.log(error);
        
    }
});
