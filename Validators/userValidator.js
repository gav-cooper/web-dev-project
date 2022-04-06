"use strict";

const joi = require("joi");

const validateOpts = {
    abortEarly: false,
    stripUnknown: true,
    errors: {
        escapeHtml: true
    }
};

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

const validateRegistration = makeBodyValidator(registerSchema);
const validateLogin        = makeBodyValidator(loginSchema);

function makeBodyValidator (schema) {
    return function (req, res, next) {
        const {value, error} = schema.validate(req.body, validateOpts)
    
        if (error) {
            const errorMessages = error.details.map(detail => detail.message);
            console.log(errorMessages);
            return res.status(400).json({"errors": errorMessages});
        } 

        req.body = value;
        next();
    }
}

module.exports = {
    validateRegistration,
    validateLogin
}