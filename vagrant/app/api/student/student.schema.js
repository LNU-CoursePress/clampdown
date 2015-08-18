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
    created:        {type: Date},
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
        this.city = normalizeCity(this.city);
    }

    var now = new Date();

    if ( !this.created ) {

        this.created = now;
    }

    next();
});


// Does not work as I wanted https://github.com/Automattic/mongoose/issues/964
/*
StudentSchema.pre('findOneAndUpdate', function (next) {

    if(this.city) {
        this.city = normalizeCity(this.city);
    }
    next();
});
*/

function normalizeCity(city) {
    var c = city.toLowerCase();
    return c.charAt(0).toUpperCase() + c.slice(1);

}

// Export the User model
exports.Student = mongoose.model('Student', StudentSchema);