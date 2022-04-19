"use strict";

const validateOpts = {
    abortEarly: false,
    stripUnknown: true,
    errors: {
        escapeHtml: true
    }
};

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
    makeValidator
}