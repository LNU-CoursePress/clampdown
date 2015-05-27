/**
 *
 */

'use strict';

var express = require('express');
var router = express.Router();

// this is used for the web site (HTML
var registrationController = require('./registration.controller');
router.get('/', registrationController.index);
router.post('/', registrationController.begin);
router.get('/thanx', registrationController.thanx);


// This supports HTML and JSON
var studentController = require('./student.controller');
router.post('/students', studentController.create);
router.get('/students', studentController.show);
router.delete('/students/:username', studentController.delete);
router.patch('/students/:username', studentController.update);

module.exports = router;