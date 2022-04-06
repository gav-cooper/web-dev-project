/*****************************************************************************/
/* app.js                                                                    */
/*****************************************************************************/

"use strict";
require("dotenv").config();

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

// Create app
const express = require("express");
const app = express();

// Enabling session management
app.use(session(sessionConfig));

// Allow access to static resources in the public directory
app.use(express.static("public", {index: "index.html", extensions: ["html"]}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Require controllers
const userController = require("./Controllers/userController");
const postController = require("./Controllers/postController");
const commentsController = require("./Controllers/commentsController");

// Validators
const userValidator = require("./Validators/userValidator");
const postValidator = require("./Validators/postValidator");

// Endpoints
app.post("/register", 
  userValidator.validateRegistration, 
  userController.createNewUser);
app.post("/login", 
  userValidator.validateLogin, 
  userController.login);

// Posts
app.post("/posts/new", 
  postValidator.validatePost,
  postController.createPost);
app.get("/posts/:postID",
  postValidator.validatePostParam,
  postController.viewPost);
// Comments
// [...]

// Testing
app.get("/api/test", (req, res) => {
    res.json({"user":req.session.user, "isLoggedIn":req.session.isLoggedIn});
})

/*****************************************************************************/
// Export app

module.exports = app;