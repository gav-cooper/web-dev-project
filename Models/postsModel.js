"use strict";

const db = require("./db");
const crypto = require("crypto");

async function addPost (username, post) {
    const postid = crypto.randomUUID();

    const sql = `
        INSERT INTO Posts 
            (postID, author, post, date) 
        VALUES 
            (@postID, @author, @post, @date)
    `;
    
    const time = Date.now();
    
    const stmt = db.prepare(sql);
    try {
        stmt.run({
            "postID":postid,
            "author":username,
            "post": post,
            "date": time
        });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}