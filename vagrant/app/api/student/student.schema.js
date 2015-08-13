'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// TODO: fix lowercase - fucked up!
var studentTypes = 'Campus Distance campus distance'.split(' ');

// define the userSchema
var StudentSchema = new Schema({
    firstname:      {type: String, required: false, maxLength: 25},
    lastname:       {type: String, required: false, maxLength: 50},
    username:       {type: String, required: true, index: true, unique: true},
    studentType:    {type: String, enum: studentTypes, required: true},
    startYear:      {type: Number, default: new Date().getFullYear() },
    services: {
        github:     {type: String, required: true, unique: true},
        linkedIn:   {type: String},
        twitter:    {type: String},
        google:    {type: String},
        facebook:    {type: String}
    }
});

// Pre hook for `findOneAndUpdate`
StudentSchema.pre('findOneAndUpdate', function(next) {
    this.options.runValidators = true;
    next();
});

// Export the User model
exports.Student = mongoose.model('Student', StudentSchema);