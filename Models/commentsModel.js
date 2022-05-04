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

function addComment(commenter, commentText, postID){
    const time = Date.now();

    const sql = `INSERT INTO Comments (commenter, commentText, post, date) 
                VALUES (@commenter, @commentText, @post, @date)`;
    const add_comment = db.prepare(sql);

    try {
        add_comment.run({
            "commenter":commenter,
            "commentText":commentText,
            "post": postID,
            "date": time
        });
        return add_comment;
    } catch (error) {
        console.error(error);
        return false;
    }
}

function getComments (postID) {
    const sql = `SELECT * FROM Comments WHERE post=@postID`;
    const getComment = db.prepare(sql);

    try {
        getComment.get({"postID":postID});
    } catch (error) {
        console.error(error);
        return false;
    }
}

/*****************************************************************************/
// Exports

module.exports = {
    addComment,
    getComments
};