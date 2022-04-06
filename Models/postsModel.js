"use strict";

const db = require("./db");
const crypto = require("crypto");

function addPost (username, subject, post) {
    // change to multer?
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

function getAllByDate () {
    const sql = `
        SELECT * FROM Posts
        ORDER BY date ASC
    `;
    const stmt = db.prepare(sql);
    const posts = stmt.all();
    return posts;
}

function getPost (postID) {
    const sql = `
        SELECT * FROM 
            Posts
        WHERE
            postID = (@postID)

    `;
    const stmt = db.prepare(sql);
    const post = stmt.get({postID});
    return post;
}

module.exports = {
    addPost,
    getAllByDate,
    getPost
}