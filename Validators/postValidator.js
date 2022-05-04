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

const queryPageSchema = joi.object({
    pageNumber: joi.number()
        .integer()
        .min(1)
})

const validatePost = validator.makeValidator(postSchema, "body");
const validatePostParam = validator.makeValidator(postParamSchema, "params");
const validateQueryPageSchema = validator.makeValidator(queryPageSchema,"params");

module.exports = {
    validatePost,
    validatePostParam,
    validateQueryPageSchema
}