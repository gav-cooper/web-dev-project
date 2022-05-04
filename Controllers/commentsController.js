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
    const {post} = req.params.postID;

    if (!(await commentsModel.addComment(userID, comment, post))) { 
        return res.sendStatus(400) 
    }

    // successfully created
    res.sendStatus(200);
}

/******************************************************************************/
// Exports 

module.exports = {
    createComment,
};