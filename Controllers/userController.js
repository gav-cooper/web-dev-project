/******************************************************************************/
/* userController.js                                                          */
/******************************************************************************/
"use strict";

// Encryption
const argon2 = require("argon2");

// Require user model
const userModel = require("../Models/userModel");

/*
    Allows the user to create a new account
*/
async function createNewUser(req, res){
    const {username, email, password} = req.body;

    // User Model returns a promise that needs to be resolved
    if (!(await userModel.addUser(username,email,password))) {
        return res.sendStatus(409);
    }
    res.sendStatus(201);
} 

/*
    Lets the user log in and initializes the session object
*/
async function login(req, res){
    // Login using username or email
    const {value, password} = req.body;

    if (!value.includes("@")){ // Login with username
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
    } else if (value.includes("@")) { // Login with email
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

/*
    Allows the user to change their password
*/
async function updatePassword(req, res) {
    if (!req.session.user) {
        return res.sendStatus(400);
    }
    if (req.params.userID !== req.session.user.userID) {
        return res.sendStatus(403);
    }

    const {oldPassword, newPassword} = req.body;
    const user = userModel.getUserByUsername(req.session.user.username);
    if (!user) {
        return res.sendStatus(400);
    }
    const {passwordHash} = user;

    // check if password supplied matches password in database
    if (!(await argon2.verify(passwordHash,oldPassword))) {
        return res.sendStatus(400);
    }
    userModel.updatePassword(req.params.userID, newPassword);
    res.sendStatus(201);
}

/*
    Allows the user to set a custom profile picture
*/
function newPfp (req, res) {
    if (!req.session.isLoggedIn) {
        return res.sendStatus(403);
    }
    const {userID} = userModel.getUserByUsername(req.session.user.username);
    userModel.updatePfp(userID,String(req.file.path));
    res.sendStatus(201);
}

module.exports = {
    createNewUser,
    login,
    updatePassword,
    newPfp
};