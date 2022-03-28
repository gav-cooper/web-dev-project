"use strict";

const db = require("./db");
const crypto = require("crypto");
const { builtinModules } = require("module");

function addPost (username, post) {
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

function getAllByDate () {
    const sql = `
        SELECT * FROM Posts
        ORDER BY date ASC
    `;
    const stmt = db.prepare(sql);
    const posts = stmt.all();
    return posts;
}

module.export = {
    addPost,
    getAllByDate
}