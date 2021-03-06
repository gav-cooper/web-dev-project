/******************************************************************************/
/* postController.js                                                          */
/******************************************************************************/

"use strict";

// Require models
const postsModel = require("../Models/postsModel");
const userModel  = require("../Models/userModel");
const commentsModel  = require("../Models/commentsModel");

/*
    This function is used to allow the user to create posts
*/
async function createPost(req, res) {
    if (!req.session.isLoggedIn) { 
        return res.sendStatus(401)
    }
    
    const {subject, post} = req.body;
    const {userID} = userModel.getUserByUsername(req.session.user.username);
    // Couldn't be added
    if (!(await postsModel.addPost(userID, subject, post))) { 
        return res.sendStatus(400) 
    }

    res.sendStatus(200);
}


/*
    This function allows the user to like posts. It does not allow them to like
    a post multiple times, so if they have already liked the post, it removes it
*/
function likePost(req, res) {
    if (!req.session.isLoggedIn) {
        return res.sendStatus(403);
    }
    if (!postsModel.getPost(req.params.postID)) {
        return res.sendStatus(404);
    }
    const {postID} = req.params;
    const {userID} = userModel.getUserByUsername(req.session.user.username);

    // Increment if user hasn't liked the post, decrement otherwise.
    if (!postsModel.checkLikes(postID, userID)) {
        postsModel.incLikes(postID,userID);
    } else {
        postsModel.decLikes(postID,userID);
    }
    res.sendStatus(200);
}

/*
    Displays every post
*/
function renderPosts(req, res) {
    if (!req.session.isLoggedIn) {
        return res.redirect("/");
    }
    let pageNumber = 1;
    if (req.query.pageNumber) {
        pageNumber = req.query.pageNumber
    }
    const numPages = (postsModel.getNumberOfPosts() / 25);
    const posts = postsModel.getAllByDate(pageNumber);
    const user = req.session.user.username
    res.render("allPosts", {posts, user, numPages});
}

/*
    Page that displays a single post
*/
function singlePost(req, res) {
    if (!req.session.isLoggedIn) {
        return res.redirect("/");
    }
    const post = postsModel.getPost(req.params.postID);
    const user = req.session.user;
    const liked = postsModel.checkLikes(req.params.postID, req.session.user.userID);
    const comments = commentsModel.getComments(req.params.postID)
    res.render("singlePost",{post, user, liked, comments});
}

/*
    Display page to allow users to make a post
*/
function newPost(req,res) {
    if (!req.session.isLoggedIn) {
        return res.redirect("/");
    }
    const user = req.session.user
    res.render("new",{user});
}

/*
    Deletes a post
*/
function deletePost (req,res) {
    if (req.params.username !== req.session.user.username) {
        return res.sendStatus(403);
    }
    const postID = req.params.postID;
    postsModel.deletePost(postID);
    res.sendStatus(200);
}

module.exports = {
    createPost,
    likePost,
    renderPosts,
    singlePost,
    newPost,
    deletePost
};