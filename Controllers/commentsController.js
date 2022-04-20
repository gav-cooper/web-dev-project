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
    if (!req.session.isLoggedIn) { 
        return res.sendStatus(401)
    }
    
    const {userID} = userModel.getUserByUsername(req.session.user.username);
    const {post, comment} = req.body;

    if (!(await commentsModel.addComment(userID, post, comment))) { 
        return res.sendStatus(400) 
    }
    res.sendStatus(200);
}


// function likeComment(req, res){}

/******************************************************************************/
// Exports 

module.exports = {
    createComment
};