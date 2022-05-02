/******************************************************************************/
/* userController.js                                                          */
/******************************************************************************/
"use strict";

// Encryption
const argon2 = require("argon2");

// Set up email transporter
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Require model
const userModel = require("../Models/userModel");
const postsModel = require("../Models/postsModel");

function mainPage(req,res) {
    if (req.session.isLoggedIn) {
        return res.redirect("/posts");
    }
    res.render("index.ejs");
}

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
                res.redirect("/posts");
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
                res.redirect("/posts");
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
    userModel.updatePfp(userID,`/pfp/${req.file.filename}`);
    res.sendStatus(201);
}

/* 
    Indicates that a user wants to reset their password
*/
async function forgottenPass (req, res) {
    const {email} = req.body;
    if (!userModel.getUserByEmail(email)) {
        return res.sendStatus(200);
    }
    // Insert into forgotten password table if no entry already, update otherwise
    if (!userModel.checkForgotPass(email)){
        userModel.forgotPass(email);
    } else {
        userModel.updateTempID(email);
    }

    const {tempID} = userModel.checkForgotPass(email);
    const text = (
        "You have requested a password reset link!\n\n" + 
        `Use this link to reset your password: ${process.env.URL}/${tempID}/forgotPassword`
    );
    
    const html = (
        "<h1 style=\"margin-bottom: 1rem;\">You have requested a link to reset your password</h1>" +
        "<p>" +
          `Click <a href="${process.env.URL}/${tempID}/forgotPassword">here</a> to reset your password!` +
        "</p>"
    );

    const emailSent = await sendEmail(email, "Password reset", text, html);
    if (emailSent) {
        res.sendStatus(200);
    } else {
        res.sendStatus(500);
    }
}

function resetPassword (req, res) {
    const {tempID} = req.params;
    if (!userModel.checkExpiration(tempID) || !userModel.checkForgotPassByID(tempID)) {
        return res.sendStatus(400);
    }
    const {userID} = userModel.getUserInfoByTempID(tempID);
    const {password} = req.body;
    userModel.updatePassword(userID, password);
    userModel.removeForgottenPass(tempID);
    res.sendStatus(200);
}

/* Return's true if the email sent succesfully and false otherwise */
async function sendEmail (recipient, subject, text, html) {
  const message = {
    from: process.env.EMAIL_ADDRESS,
    to: recipient,
    subject: subject,
    text: text,
    html: html
  };
  
  try {
    await transporter.sendMail(message);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

function resetPasswordPage (req,res) {
    res.render("resetPassword.ejs");
}

function displayUser (req,res) {
    if (!req.session.isLoggedIn) {
        return res.redirect("/");
    }
    if (req.params.username === req.session.user.username) {
        return res.redirect(`/account/${req.params.username}`)
    }
    const user = userModel.getUserByUsername(req.params.username);
    res.render("displayUser",{user});
}

function displayUserPosts (req,res) {
    if (!req.session.isLoggedIn) {
        return res.redirect("/");
    }
    const user = req.session.user;
    const posts = postsModel.postsByUser(req.params.username);
    res.render("displayUserPosts",{posts, user})
}

function displayAccountPage(req,res) {
    if (!req.session.isLoggedIn) {
        return res.redirect("/");
    }
    let user = userModel.getUserByUsername(req.params.username);
    if (req.params.username !== req.session.user.username) {
        user = false;
    }
    res.render("accountPage", {user})
}

module.exports = {
    mainPage,
    createNewUser,
    login,
    updatePassword,
    newPfp,
    forgottenPass,
    resetPassword,
    resetPasswordPage,
    displayUser,
    displayUserPosts,
    displayAccountPage
};