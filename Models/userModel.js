/*****************************************************************************/
/* userModel.js                                                              */
/*****************************************************************************/


"use strict";
const db = require("./db");

const crypto = require("crypto");
const argon2 = require('argon2');


/******************************************************************************/
// Sessions
const redis = require('redis');
const session = require("express-session");
const { getMaxListeners } = require("process");

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
async function updatePassword(userID, password) {
    const hash = await argon2.hash(password);
    const sql = `
        UPDATE Users SET 
           passwordHash = @hash
        WHERE 
            userID = @userID`;
    const stmt = db.prepare(sql);
    stmt.run({userID, hash});
}

function updatePfp(userID, pfpPath) {
    const sql = `
        UPDATE Users SET 
           pfpPath = (@pfpPath)
        WHERE 
            userID = @userID`;
    const stmt = db.prepare(sql);
    stmt.run({userID, pfpPath});
}

/*
    Create an entry into the forgotten passwords table
*/
function forgotPass (email) {
    const tempID = crypto.randomUUID();
    const expiration = Date.now() + 18000000;
    const sql = `
        INSERT INTO ForgottenPass 
            (tempID, email, expiration) 
        VALUES 
            (@tempID, @email, @expiration)
    `;
    const stmt = db.prepare(sql);
    try {
        stmt.run({
            tempID, email, expiration
        })
        return true;
    } catch (error){
        console.error(error)
        return false;
    }
}

/*
    Already have an entry into the forgotten password table, update the value
*/
function updateTempID (email) {
    const tempID = crypto.randomUUID();
    const expiration = Date.now() + 18000000;
    const sql = `
        UPDATE ForgottenPass SET
            tempID = @tempID, expiration = @expiration
        WHERE email = @email
    `;
    const stmt = db.prepare(sql);
    try {
        stmt.run({
            tempID, email, expiration
        })
        return true;
    } catch (error){
        console.error(error)
        return false;
    }
}

/*
    See if entry exists using email
*/
function checkForgotPass (email) {
    const sql = `
        SELECT * FROM ForgottenPass WHERE email = @email;
        `;
    const stmt = db.prepare(sql);
    const record = stmt.get({
        email
    });
    if (record) {
        return record;
    } else {
        return false;
    }
}

/*
    See if entry exists using tempID
*/
function checkForgotPassByID (tempID) {
    const sql = `
        SELECT * FROM ForgottenPass WHERE tempID = @tempID;
        `;
    const stmt = db.prepare(sql);
    const record = stmt.get({
        tempID
    });
    if (record) {
        return true;
    } else {
        return false;
    }
}

/*
    Ensure the entry is still valid
*/
function checkExpiration (tempID) {
    const sql = `
        SELECT * FROM ForgottenPass WHERE tempID = @tempID;
        `;
    const stmt = db.prepare(sql);
    const record = stmt.get({
        tempID
    });

    const {expiration} = record;
    const time = Date.now();

    if (time < expiration) {
        return true;
    } else {
        return false;
    }
}

/*
    Allow access to main Users table
*/
function getUserInfoByTempID (tempID) {
    const sql = `
        SELECT userID, tempID FROM Users
        JOIN ForgottenPass ON
            ForgottenPass.email = Users.email
        WHERE
            tempID = @tempID;
        `;
    const stmt = db.prepare(sql);
    const record = stmt.get({
        tempID
    });
    return record;
}

function removeForgottenPass (tempID) {
    const sql = `
        DELETE FROM ForgottenPass WHERE tempID = @tempID;
    `;
    const stmt = db.prepare(sql);
    stmt.run({tempID});
}

module.exports = {
    addUser,
    getUserByUsername,
    getUserByEmail,
    updatePassword,
    updatePfp,
    forgotPass,
    updateTempID,
    checkForgotPass,
    checkExpiration,
    checkForgotPassByID,
    getUserInfoByTempID,
    removeForgottenPass
};