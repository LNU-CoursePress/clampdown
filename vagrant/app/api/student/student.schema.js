'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var studentTypes = 'Campus Distance'.split(' ');

// define the userSchema
var StudentSchema = new Schema({
    firstname:      {type: String, required: true, maxLength: 25},
    lastname:       {type: String, required: true, maxLength: 50},
    username:       {type: String, required: true, index: true},
    studentType:    {type: String, enum: studentTypes, required: true},
    startYear:      {type: Number, default: new Date().getFullYear() },
    services: {
        github:     {type: String, required: true},
        linkedIn:   {type: String},
        twitter:    {type: String}
    }
});

// Export the User model
exports.Student = mongoose.model('Student', StudentSchema);