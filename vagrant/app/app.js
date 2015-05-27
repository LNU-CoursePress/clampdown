/**
 * Main application file
 */

'use strict';


// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// TODO: refactor


var express = require('express');
var config = require('./config/environment');

// Start db
var mongoose = require('mongoose');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
var db = require('./dbFactory');
db.createDbConnection(config.mongo.uri); // doesn't mind the async here - only serverstart


// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }



var app = express();
require('./config/express')(app);
require('./routes')(app);

var server = app.listen(config.port, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s, ENV: %s', host, port, app.get('env'));
});

// Expose app
exports = module.exports = app;

// This is a wrapper for smarter loading of helper modules
// eg. rootRequire('app/helpers/gh');
global.rootRequire = function(name) {
    return require(__dirname + '/' + name);
}