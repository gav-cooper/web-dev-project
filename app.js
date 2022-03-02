"use strict";
require("dotenv").config();

const express = require("express");
const { send } = require("express/lib/response");
const app = express();

app.use(express.json());

// Require model
const userModel = require("./Models/userModel")


app.post("/users", (req,res) => {
    if (!req.body.username|!req.body.email|req.body.password) {
        return res.send("Missing keys!");
    }
    const {username,email,password} = req.body;
    userModel.createUser(username,email,password);
    res.sendStatus(200);
});

module.exports = app;