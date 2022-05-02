/*****************************************************************************/
/* app.js                                                                    */
/*****************************************************************************/

"use strict";
require("dotenv").config();
const helmet = require("helmet");
const isProduction = process.env.NODE_ENV === "production";

// Session Management
const redis = require("redis");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);

// Create app
const express = require("express");
const app = express();

if (isProduction) {
  app.set('trust proxy', 1);
  app.use(helmet());
}

const sessionConfig = {
  store: new RedisStore({ client: redis.createClient() }),
  secret: process.env.COOKIE_SECRET, 
  resave: false,
  saveUninitialized: false,
  name: "session", // now it is just a generic name
  cookie: {
    sameSite: isProduction,
    secure: isProduction,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 8, // 8 hours
  }
};

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
const commentValidator = require("./Validators/commentValidator");

// Multer
const pfpUpload = require("./pfpUploader");

app.set("view engine", "ejs");

// Endpoints
app.get("/",userController.mainPage);
app.post("/register", 
  userValidator.validateRegistration, 
  userController.createNewUser);
app.post("/login", 
  userValidator.validateLogin, 
  userController.login);
app.post("/logout",userController.logout);
app.post("/forgottenPassword", 
  userValidator.validateEmail, 
  userController.forgottenPass);
app.post("/:tempID/forgotPassword",
  userValidator.validatePassword,
  userController.resetPassword);
app.get("/:tempID/forgotPassword",userController.resetPasswordPage);

// Users
// app.get("/user/:userID/forgotPassword")
app.get("/users/:username", userController.displayUser);
app.post("/users/:userID/password",userController.updatePassword);
app.post("/users/:userID/pfp",pfpUpload.pfp.single("pfp"),userController.newPfp);
app.get("/users/:username/posts",userController.displayUserPosts);
app.get("/account/:username",userController.displayAccountPage);
app.get("/account/:username/posts",userController.displayAccountPosts);

// Posts
app.get("/posts",postController.renderPosts);
app.get("/posts/:postID",
  postValidator.validatePostParam,
  postController.singlePost);
app.get("/new",postController.newPost);
app.post("/posts", 
  postValidator.validatePost,
  postController.createPost);
app.post("/posts/:postID/like",
  postValidator.validatePostParam,
  postController.likePost);
// app.delete("/account/:username/posts/:postID",postController.deletePost)

// Comments

// creating comment on post
app.post("/posts/:postID/comments",
  commentValidator.validateComment,
  commentValidator.validateCommentParam,
  commentsController.createComment);

// liking comment on post
// app.post("/posts/:postID/comments/like",
//   commentValidator.validateCommentParam,
//   commentsController.likeComment);

// Testing
app.get("/api/test", (req, res) => {
    res.json({"user":req.session.user, "isLoggedIn":req.session.isLoggedIn});
});

/*****************************************************************************/
// Export app

module.exports = app;