const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const app = express();
const route = require("./routes/routes");
const bodyparser = require("body-parser");

app.use(express.json());
app.use("/",route);

app.listen(3000,()=>{
    console.log("Local Host:3000");

    try {
        mongoose.connect(process.env.DB,
            {

            });

        console.log("Database connected");
    } catch (error) {
        console.log(error);
        
    }
});
