"use strict";
require("dotenv").config();

const argon2 = require("argon2");
const express = require("express");
const { send } = require("express/lib/response");
const app = express();

app.use(express.json());

// Require model
const userModel = require("./Models/userModel")

app.post("/users", async (req,res) => {
    if (req.body.username.includes("@") || !req.body.username || 
        !req.body.email || !req.body.password) {
        return res.sendStatus(400);
    }

    const {username,password} = req.body;
    let {email} = req.body;
    email = email.toLowerCase();

    // User Model returns a promise that needs to be resolved
    if (!(await userModel.createUser(username,email,password))) {
        return res.sendStatus(409);
    }
    res.sendStatus(201);
});

app.post("/login", async (req,res) => {
    // Login using username or email
    if (!req.body.value || !req.body.password) {
        return res.sendStatus(400);
    }

    if (!req.body.value.includes("@")){ // Login with username
        const {value, password} = req.body;
        const user = userModel.getUserByUsername(value);
        if (!user) {
            return res.sendStatus(400);
        }

        const {passwordHash} = user;
        if (await argon2.verify(passwordHash,password)) {
            // User login success
            res.sendStatus(200);
        } else {
            // User login failure
            res.sendStatus(400);
        }
    } else if (req.body.value.includes("@")) { // Login with email
        let {value} = req.body;
        let email = value.toLowerCase();
        const {password} = req.body;

        const user = userModel.getUserByEmail(email);
        if (!user) {
            return res.sendStatus(400);
        }
        
        const {passwordHash} = user;
        if (await argon2.verify(passwordHash,password)) {
            // User login success
            res.sendStatus(200);
        } else {
            // User login failure
            res.sendStatus(400);
        }
    }
});

module.exports = app;