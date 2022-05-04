/******************************************************************************/
/* commentsController.js                                                      */
/******************************************************************************/

"use strict";

/******************************************************************************/
// Require model
const commentsModel = require("../Models/commentsModel");
const userModel  = require("../Models/userModel");

/******************************************************************************/
// Functions

async function createComment(req, res){
    // disallow access if not logged in 
    if (!req.session.isLoggedIn) { 
        return res.sendStatus(401)
    }
    
    // getting params for addComment()
    const {userID} = userModel.getUserByUsername(req.session.user.username);
    const {comment} = req.body;
    const {post} = req.params;

    if (!(await commentsModel.addComment(userID, post, comment))) { 
        return res.sendStatus(400) 
    }

    // successfully created
    res.sendStatus(200);
}

function renderComments(req, res) {
    if (!req.session.isLoggedIn) {
        return res.redirect("/");
    }
    const comment = commentsModel.getComments(req.params.postID);
    console.log(comment);
    res.render("renderComments",{comment});
}


/******************************************************************************/
// Exports 

module.exports = {
    createComment,
    renderComments
};