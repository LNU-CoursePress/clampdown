/**
 * Main application file
 */
"use strict";
var debug = require("debug")("start");

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || "development";

debug("Enviroment mode is: ", process.env.NODE_ENV);

var express = require("express");
var config = require("./config/environment");

// Connect to database
if (process.env.NODE_ENV !== "test") {
    var db = require("./dbFactory");
    db.createDbConnection(config.mongo.uri, config.mongo.options); // doesn't mind the async here - only serverstart
    // Populate DB with sample data
    if (config.seedDB) {
        require("./config/seed").seed(function() {
            debug("Got stuff seeded");
        });
    }
}

var app = express();
require("./config/express")(app);
require("./routes")(app);

var server = app.listen(config.port, function() {
    var host = server.address().address;
    var port = server.address().port;
    debug("Example app listening at http://%s:%s, ENV: %s", host, port, app.get("env"));
});

// Expose app
exports = module.exports = server;
