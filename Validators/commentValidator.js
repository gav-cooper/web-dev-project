/*****************************************************************************/
/* commentValidator.js                                                       */
/*****************************************************************************/

"use strict";

const joi = require("joi");
const validator = require("./makeValidator");

/*****************************************************************************/

const commentSchema = joi.object({
    commentText: joi.string()
});
const validateComment = validator.makeValidator(commentSchema, "body");

module.exports = {
    validateComment,
}