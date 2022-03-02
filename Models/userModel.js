"use strict";

const db = require("./db");
const crypto = require("crypto");
const argon2 = require('argon2');

async function createUser (username, email, password) {
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
    } catch (error) {
        console.error(error);
    }
}

exports.createUser = createUser;