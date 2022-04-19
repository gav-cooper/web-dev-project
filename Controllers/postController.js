/******************************************************************************/
/* postController.js                                                          */
/******************************************************************************/

"use strict";

/******************************************************************************/
// Require post model
const postsModel = require("../Models/postsModel");
const userModel  = require("../Models/userModel");

/******************************************************************************/
// Functions

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

function viewPost(req,res) {
    // used soley for testing
    console.log(postsModel.getPost(req.params.postID));
    res.sendStatus(200);
}

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

// function renderPosts(req, res) {

// }

// function singlePost(req, res) {

// }
/******************************************************************************/
// Exports 

module.exports = {
    createPost,
    viewPost,
    likePost
};