/*
    This file is used to in order to set up multer for uploading profile pictures
*/

"use strict";

const crypto = require("crypto");
const multer = require("multer");

const pfp = multer({
  storage: multer.diskStorage({
    destination (req, file, cb) {
      cb(null, "public/pfp");
    },
    filename (req, file, cb) {
      // Generate a random name
      const randomName = crypto.randomBytes(12).toString('hex');

      // Get the extension from the file's original name
      const [extension] = file.originalname.split(".").slice(-1);
      // Now the random name preserves the file extension
      cb(null, `${randomName}.${extension}`);
    },
  }),
  fileFilter (req, file, cb) {      
    if (!req.session && req.session.role !== 1) {
      return cb(null, false); // reject if the file is not an admin
    }
    if (file.mimetype.startsWith("image/")) {
      return cb(null, true); // accept the file
    } else {
      return cb(null, false); // reject the file
    }
  },
});

module.exports = {
    pfp
}