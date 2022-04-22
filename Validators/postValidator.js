"use strict";

const joi = require("joi");
const validator = require("./makeValidator");

const postSchema = joi.object({
    subject: joi.string()
        .required(),

    post: joi.string()
        .required(),
});

const postParamSchema = joi.object({
    postID: joi.string()
        .required()
});

const validatePost = validator.makeValidator(postSchema, "body");
const validatePostParam = validator.makeValidator(postParamSchema, "params");

module.exports = {
    validatePost,
    validatePostParam
}