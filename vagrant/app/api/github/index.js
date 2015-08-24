var express = require("express");
var router = express.Router();

var githubController = require("./github.controller");
router.get("/api/github/:username", githubController.check);

module.exports = router;