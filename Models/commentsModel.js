/*****************************************************************************/
/* commentsModel.js                                                          */
/*****************************************************************************/

"use strict";

/*****************************************************************************/
// Requires
const db = require("./db");
const crypto = require("crypto");

/*****************************************************************************/
// Functions

function addComment(commenter, comment, postID){
    const time = Date.now();

    const sql = `INSERT INTO Comments (commenter, comment, post, date) 
                VALUES (@commenter, @comment, @post, @date)`;
    const add_comment = db.prepare(sql);

    try {
        add_comment.run({
            "commenter":commenter,
            "comment":comment,
            "post": postID,
            "date": time
        });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

function getComments (postID) {
    const sql = `SELECT * FROM Comments WHERE post=@postID`;
    const getComment = db.prepare(sql);
    const comments = getComment.get({"postID":postID});

    return comments;
}

/*****************************************************************************/
// Exports

module.exports = {
    addComment,
    getComments
};