"use strict";

const joi = require("joi");

const validateOpts = {
    abortEarly: false,
    stripUnknown: true,
    errors: {
        escapeHtml: true
    }
};

const postSchema = joi.object({
    subject: joi.string()
        .lowercase()
        .required(),

    post: joi.string()
        .required(),
});

const postParamSchema = joi.object({
    postID: joi.string()
        .required()
});

const validatePost = makeValidator(postSchema, "body");
const validatePostParam = makeValidator(postParamSchema, "params");

function makeValidator (schema, prop="body") {
    return function (req, res, next) {
        const {value, error} = schema.validate(req[prop], validateOpts)
    
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
    validatePost,
    validatePostParam
}