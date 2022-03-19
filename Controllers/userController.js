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
    const {username, password} = req.body;
    userModel.addUser(username, password);
    res.sendStatus(201);
} 

// Login
async function login(req, res){
    const {username, password} = req.body;
    const user = userModel.getUserByUsername(username);

    const {hash} = user;
    if (await argon2.verify(hash, password)){
        req.session.regenerate((err) => {
            if (err){
                console.error(err);
                return res.sendStatus(500);  // internal server error
            }

            req.session.user = {};
            req.session.user.username = username;
            req.session.user.userID = user.userID;
            req.session.isLoggedIn = true;

            res.sendStatus(200);
        });
    } else{
        res.sendStatus(400);
    }
}

/******************************************************************************/

module.exports = {
    createNewUser,
    login
};