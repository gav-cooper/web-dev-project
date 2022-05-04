/*****************************************************************************/
/* postsModel.js                                                             */
/*****************************************************************************/

"use strict";

const db = require("./db");
const crypto = require("crypto");

function addPost (username, subject, post) {
    const postid = crypto.randomUUID();

    const sql = `
        INSERT INTO Posts 
            (postID, author, subject, post, date) 
        VALUES 
            (@postID, @author, @subject, @post, @date)
    `;
    
    const time = Date.now();
    
    const stmt = db.prepare(sql);
    try {
        stmt.run({
            "postID":postid,
            "author":username,
            "subject":subject,
            "post": post,
            "date": time
        });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

function getNumberOfPosts (post) {
    const sql = `SELECT count(*) as count FROM Posts`;
    const stmt = db.prepare(sql);
    const numPosts = stmt.get();
    return numPosts.count;
}

function getNumUserPosts (author) {
    const sql = `SELECT count(*) as count FROM Posts WHERE author=@author`;
    const stmt = db.prepare(sql);
    const numPosts = stmt.get({author});
    return numPosts.count;
}

function getAllByDate (pageNumber) {
    const offset = (pageNumber - 1) * 25;
    const sql = `
        SELECT postID, subject, date, likes, username, pfpPath FROM Posts
        JOIN Users on
            Posts.author=Users.userID
        ORDER BY date DESC
        LIMIT 25 OFFSET (@offset)
    `;
    const stmt = db.prepare(sql);
    const posts = stmt.all({offset});
    return posts;
}

function getAllByLikes () {
    const sql = `
        SELECT * FROM Posts
        ORDER BY likes ASC
    `;
    const stmt = db.prepare(sql);
    const posts = stmt.all();
    return posts;
}

function getPost (postID) {
    const sql = `
        SELECT postID, subject, post, date, likes, username FROM 
            Posts
        JOIN Users on
            Posts.author=Users.userID
        WHERE
            postID = (@postID)

    `;
    const stmt = db.prepare(sql);
    const post = stmt.get({postID});
    return post;
}

function incLikes (postID, userID) {
    const sql1 = `
        UPDATE Posts
        SET 
            likes = (likes + 1)
        WHERE
            postID = @postID
    `;

    const sql2 = `
        INSERT INTO PostLikes
            (postID, userID)
        VALUES
            (@postID, @userID)
    `;

    const stmt1 = db.prepare(sql1);
    const stmt2 = db.prepare(sql2);

    try {
        stmt1.run({postID});
        stmt2.run({postID,userID});
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

function decLikes (postID, userID) {
    const sql1 = `
        UPDATE Posts
        SET 
            likes = (likes - 1)
        WHERE
            postID = @postID
    `;

    const sql2 = `
        DELETE FROM PostLikes
        WHERE
            userID = @userID
    `;

    const stmt1 = db.prepare(sql1);
    const stmt2 = db.prepare(sql2);

    try {
        stmt1.run({postID});
        stmt2.run({userID});
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

function checkLikes (postID, userID) {
    const sql =`
        SELECT * FROM PostLikes
        WHERE
            postID = @postID AND
            userID = @userID
    `;
    const stmt = db.prepare(sql);
    const like = stmt.get({postID, userID});
    return like;
}

function postsByUser (username, pageNumber) {
    const offset = (pageNumber - 1) * 25;
    const sql = `
        SELECT postID, subject, date, likes, username, pfpPath FROM Posts
        JOIN Users on
            Posts.author=Users.userID
        WHERE Users.username=@username
        ORDER BY date DESC
        LIMIT 25 OFFSET (@offset)
    `;
    const stmt = db.prepare(sql);
    const posts = stmt.all({username, offset});
    return posts;
}

function deletePost (postID) {
    const sql = `DELETE FROM Posts WHERE postID = @postID`;
    const sql1 = `DELETE FROM PostLikes WHERE postID = @postID`;
    const stmt = db.prepare(sql);
    const stmt1 = db.prepare(sql1);
    stmt1.run({postID});
    stmt.run({postID});
}

module.exports = {
    addPost,
    getNumberOfPosts,
    getNumUserPosts,
    getAllByDate,
    getAllByLikes,
    getPost,
    incLikes,
    decLikes,
    checkLikes,
    postsByUser,
    deletePost
}