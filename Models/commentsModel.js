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

function addComment(commenter, post, comment){
    // generating unique identifier for comment ID
    const commentid = crypto.randomUUID();

    // will display time on comment
    const time = Date.now();

    const sql = `
        INSERT INTO Comments 
            (commentID, commenter, comment, post, date) 
        VALUES 
            (@commentID, @commenter, @comment, @post, @date)`;
    const add_comment = db.prepare(sql);

    // try-catch for any errors
    try {
        add_comment.run({
            "commentID":commentid,
            "commenter":commenter,
            "comment":comment,
            "post": post,
            "date": time
        });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

// add functions to manage comment likes (check and change)

/*****************************************************************************/
// Exports

module.exports = {
    addComment
};