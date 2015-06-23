/**
 *
 */

'use strict';

var express = require('express');
var router = express.Router();


// This supports only JSON
var studentController = require('./student.controller');
router.post('/api/students', studentController.create);
router.get('/api/students', studentController.list);
router.delete('/api/students/:username', studentController.delete);
router.patch('/api/students/:username', studentController.update);

module.exports = router;