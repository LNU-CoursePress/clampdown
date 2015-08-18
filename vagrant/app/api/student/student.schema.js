'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// TODO: fix lowercase - fucked up!
var studentTypes = 'campus distance Campus Distance'.split(' ');

// define the userSchema
var StudentSchema = new Schema({
    firstname:      {type: String, required: false, maxLength: 25},
    lastname:       {type: String, required: false, maxLength: 50},
    personNumber:   {type: String},
    city:           {type: String},
    username:       {type: String, required: true, index: true, unique: true},
    studentType:    {type: String, enum: studentTypes, required: true},
    created:        {type: Date, default: new Date() },
    program:        {type: String},
    services: {
        github:     {type: String, required: true, unique: true},
        linkedin:   {type: String},
        twitter:    {type: String},
        google:     {type: String},
        facebook:   {type: String}
    },
    metaData: {type: Object}
});

// Pre hook for `findOneAndUpdate`
StudentSchema.pre('findOneAndUpdate', function(next) {
    this.options.runValidators = true;
    next();
});


StudentSchema.pre('save', function (next) {
    if(this.city) {
        var city = this.city.toLowerCase();
        this.city = city.charAt(0).toUpperCase() + city.slice(1);
    }

    next();
});

// Export the User model
exports.Student = mongoose.model('Student', StudentSchema);