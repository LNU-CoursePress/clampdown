/**
 * Main application file
 */

'use strict';


// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');

// Connect to database
var db = require('./dbFactory');
db.createDbConnection(config.mongo.uri, config.mongo.options); // doesn't mind the async here - only serverstart


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
