"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var uniqueValidator = require("mongoose-unique-validator");

// TODO: fix lowercase - fucked up!
var studentTypes = "campus distance".split(" ");

function toLower(v) {
    return v.toLowerCase();
}

// define the userSchema
var StudentSchema = new Schema({
    username:       {type: String, required: true, index: true, unique: true},
    firstname:      {type: String, required: false, maxLength: 50},
    lastname:       {type: String, required: false, maxLength: 50},
    personNumber:   {type: String},
    city:           {type: String},
    studentType:    {type: String, enum: studentTypes, required: true, set: toLower},
    created:        {type: Date},
    updated:        {type: Date},
    program:        {type: String},
    services: {
        github:     {type: String, required: true, unique: true},
        linkedin:   {type: String},
        twitter:    {type: String},
        google:     {type: String},
        facebook:   {type: String},
        skype:      {type: String}
    },
    metaData: {type: Object}
});

// Pre hook for `findOneAndUpdate`
StudentSchema.pre("findOne", function(next) {
    preUpdate(this, next);
});

StudentSchema.pre("findOneAndUpdate", function(next) {
    preUpdate(this, next);
});

StudentSchema.pre("find", function(next) {
    preUpdate(this, next);
});

function preUpdate(context, next) {
    context.update({}, { $set: { updated: new Date() } });
    next();
}

// Todo: Don't normilize on update?
StudentSchema.pre("save", function(next) {
    if (this.city) {
        this.city = normalizeCity(this.city);
    }

    var now = new Date();

    if (!this.created) {
        this.created = now;
    }

    this.updated = now;

    next();
});

StudentSchema.plugin(uniqueValidator);

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
exports.Student = mongoose.model("Student", StudentSchema);