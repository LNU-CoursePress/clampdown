'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define the userSchema
var StudentSchema = new Schema({
    username: String,
    githubName: String
});

// Export the User model
exports.Student = mongoose.model('Student', StudentSchema);