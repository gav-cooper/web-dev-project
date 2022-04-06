/******************************************************************************/
/* userController.js                                                          */
/******************************************************************************/

"use strict";

/******************************************************************************/
// Encryption
const argon2 = require("argon2");

/******************************************************************************/
// Require user model
const userModel = require("../Models/userModel");

/******************************************************************************/

async function createNewUser(req, res){
    const {password} = req.body;
    let {username, email} = req.body;

    // User Model returns a promise that needs to be resolved
    if (!(await userModel.addUser(username,email,password))) {
        return res.sendStatus(409);
    }
    res.sendStatus(201);
} 

// Login
async function login(req, res){
    // Login using username or email
    let {value} = req.body;
    const {password} = req.body;
    
    if (!req.body.value.includes("@")){ // Login with username
        const user = userModel.getUserByUsername(value);
        if (!user) {
            return res.sendStatus(400);
        }

        const {passwordHash} = user;
        if (await argon2.verify(passwordHash,password)) {
            req.session.regenerate((err) => {
                if (err){
                    console.error(err);
                    return res.sendStatus(500);  // internal server error
                }
    
                req.session.user = {};
                req.session.user.username = user.username;
                req.session.user.userID = user.userID;
                req.session.isLoggedIn = true;
                res.sendStatus(200);
            });
        } else {
            // User login failure
            res.sendStatus(400);
        }
    } else if (req.body.value.includes("@")) { // Login with email
        const user = userModel.getUserByEmail(value);
        if (!user) {
            return res.sendStatus(400);
        }
        
        const {passwordHash} = user;
        if (await argon2.verify(passwordHash,password)) {
            req.session.regenerate((err) => {
                if (err){
                    console.error(err);
                    return res.sendStatus(500);  // internal server error
                }
    
                req.session.user = {};
                req.session.user.username = user.username;
                req.session.user.userID = user.userID;
                req.session.isLoggedIn = true;
                res.sendStatus(200);
            });
        } else {
            // User login failure
            res.sendStatus(400);
        }
    }
}

/******************************************************************************/
// Exports 

module.exports = {
    createNewUser,
    login
};