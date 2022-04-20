/*****************************************************************************/
/* commentValidator.js                                                       */
/*****************************************************************************/

"use strict";

const joi = require("joi");
const validator = require("./makeValidator");

/*****************************************************************************/

const commentSchema = joi.object({
    comment: joi.string()
        .required(),
});

const commentParamSchema = joi.object({
    commentID: joi.string()
        .required()
});

const validateComment = validator.makeValidator(commentSchema, "body");
const validateCommentParam = validator.makeValidator(commentParamSchema, "params");

module.exports = {
    validateComment,
    validateCommentParam
}