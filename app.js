/*****************************************************************************/
/* app.js                                                                    */
/*****************************************************************************/

"use strict";
require("dotenv").config();

/*****************************************************************************/
// Session Management

const redis = require("redis");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);

const sessionConfig = {
  store: new RedisStore({ client: redis.createClient() }),
  secret: process.env.COOKIE_SECRET, 
  resave: false,
  saveUninitialized: false,
  name: "session", // now it is just a generic name
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 8, // 8 hours
  }
};

/*****************************************************************************/
// Create app

const express = require("express");
const app = express();

/*****************************************************************************/
// Enabling session management

app.use(session(sessionConfig));

/*****************************************************************************/
// Allow access to static resources in the public directory

app.use(express.static("public", {index: "index.html", extensions: ["html"]}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*****************************************************************************/

// Require model
const userController = require("./Controllers/userController");


app.post("/users", async (req,res) => {
    if (req.body.username.includes("@") || !req.body.username || 
        !req.body.email || !req.body.password) {
        return res.sendStatus(400);
    }

    const {username,password} = req.body;
    let {email} = req.body;
    email = email.toLowerCase();

    // User Model returns a promise that needs to be resolved
    if (!(await userModel.addUser(username,email,password))) {
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