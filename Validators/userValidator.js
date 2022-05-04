"use strict";

const joi = require("joi");
const validator = require("./makeValidator");

const registerSchema = joi.object({
    username: joi.string()
        .min(3)
        .token()
        .lowercase()
        .required(),

    email: joi.string()
        .email()
        .required(),

    password: joi.string()
        .min(6)
        .required()
});

const loginSchema = joi.object({
    value: joi.string()
        .lowercase(),

    password: joi.string()
        .min(6)
        .required()
});

const emailSchema = joi.object({
    email: joi.string()
        .email()
        .required()
});

const tempIDSchema = joi.object({
    tempID: joi.string()
        .required()
});

const passwordSchema = joi.object({
    password: joi.string()
        .min(6)
        .required()
});

const newPasswordSchema = joi.object({
    oldPassword: joi.string()
        .min(6)
        .required(),
    
    newPassword: joi.string()
        .min(6)
        .required(6)
})

const validateRegistration = validator.makeValidator(registerSchema);
const validateLogin        = validator.makeValidator(loginSchema);
const validateEmail        = validator.makeValidator(emailSchema);
const validatePassword     = validator.makeValidator(passwordSchema,"body");
const validateNewPassword  = validator.makeValidator(newPasswordSchema);

module.exports = {
    validateRegistration,
    validateLogin,
    validateEmail,
    validatePassword,
    validateNewPassword
};