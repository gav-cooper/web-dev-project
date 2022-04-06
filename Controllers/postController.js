/******************************************************************************/
/* postController.js                                                          */
/******************************************************************************/

"use strict";

/******************************************************************************/
// Require post model
const postsModel = require("../Models/postsModel");

/******************************************************************************/
// Functions

async function createPost(req, res) {
    if (!req.session.isLoggedIn) { 
        return res.sendStatus(401)
    }
    
    const {subject, post} = req.body;
    // Couldn't be added
    if (!(await postsModel.addPost(req.session.user.username, subject, post))) { 
        return res.sendStatus(400) 
    }

    res.sendStatus(200);
}

function viewPost(req,res) {
    console.log(postsModel.getPost(req.params.postID));
    res.sendStatus(200);
}

/******************************************************************************/
// Exports 

module.exports = {
    createPost,
    viewPost
};