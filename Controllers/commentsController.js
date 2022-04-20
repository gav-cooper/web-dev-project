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
    const {post, comment} = req.body;

    if (!(await commentsModel.addComment(userID, post, comment))) { 
        return res.sendStatus(400) 
    }

    // successfully created
    res.sendStatus(200);
}


// function likeComment(req, res){}

/******************************************************************************/
// Exports 

module.exports = {
    createComment
};