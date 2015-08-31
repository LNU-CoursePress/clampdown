/**
 *
 */

"use strict";

var express = require("express");
var router = express.Router();
var keys = require("../../config/environment").secrets;

// Load Batch Request
var batch = require("batch-request")({
    max: 30,
    allowedHosts: ["192.168.50.50:3000", "coursehub.lnu.se"]
});

var key;

// add middleware for handling API keys
// this is checking all the requests and getting the
// authorization header

router.use(function(req, res, next) {

    if (!req.headers.authorization) { // check the header
        return res.sendStatus(401);
    }
    else {
        key = req.headers.authorization;
    }

    if (req.method === "GET" || req.method === "HEAD") { // if its just a GET we allow both read and write key
        if (!isReadKey(key) && !isWriteKey(key)) {
            return res.sendStatus(401);
        }
    }
    else {
        if (!isWriteKey(key)) { // all other demands write key
            return res.sendStatus(401);
        }
    }

    next();
});

// This supports only JSON
var studentController = require("./student.controller");
router.post("/api/students", studentController.create);
router.get("/api/students", studentController.list);
router.get("/api/students/:username", studentController.show);
router.delete("/api/students/:username", studentController.delete);
router.patch("/api/students/:username", studentController.update);

// Use Batch Request as middleware on an endpoint you want to service batch requests
router.post("/api/students/batch", batch.validate, batch);

module.exports = router;

// Private help methods
function isReadKey(key) {
    return key === keys.APIReadKey;
}

function isWriteKey(key) {
    return key === keys.APIWriteKey;
}
