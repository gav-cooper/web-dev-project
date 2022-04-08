"use strict";
const db = require("./db");

const crypto = require("crypto");
const argon2 = require('argon2');


/******************************************************************************/
// Sessions
const redis = require('redis');
const session = require("express-session");

/******************************************************************************/

async function addUser (username, email, password) {
    const uuid = crypto.randomUUID();
    const hash = await argon2.hash(password);

    const sql = `
        INSERT INTO Users 
            (userID, username, email, passwordHash) 
        VALUES 
            (@userID, @username, @email, @passwordHash)
    `;
    
    const stmt = db.prepare(sql);
    try {
        stmt.run({
            "userID":uuid,
            "username":username,
            "email":email,
            "passwordHash":hash
        });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

function getUserByUsername(username) {
    const sql = `
        SELECT * FROM Users WHERE username = @username;
        `;
    const stmt = db.prepare(sql);
    const record = stmt.get({
        username
    });
    
    return record;
}

function getUserByEmail(email) {
    const sql = `
        SELECT * FROM Users WHERE email = @email;
        `;
    const stmt = db.prepare(sql);
    const record = stmt.get({
        email
    });
    
    return record;
}

// Updates values if new data is provided, otherwise uses data already in DB
function updateUser(userID, username, email, passwordHash, pfpPath) {
    const sql = `
        UPDATE Users SET 
           username = COALESCE(@username, username), 
           email = COALESCE(@email, email), 
           passwordHash = COALESCE(@passwordHash, passwordHash),
           pfpPath = COALESCE(@pfpPath, pfpPath)
        WHERE 
            userID = @userID`;
    const stmt = db.prepare(sql);
    stmt.run({userID, username, email, passwordHash, pfpPath});
}

module.exports = {
    addUser,
    getUserByUsername,
    getUserByEmail,
    updateUser
};