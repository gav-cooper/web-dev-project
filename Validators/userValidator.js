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

const validateRegistration = validator.makeValidator(registerSchema);
const validateLogin        = validator.makeValidator(loginSchema);

module.exports = {
    validateRegistration,
    validateLogin
};