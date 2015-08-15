var express = require('express');
var router = express.Router();

//TODO: Add a route for checking if a username exists on Github
var githubController = require('./github.controller');
router.get('/api/github/:username', githubController.check);

module.exports = router;