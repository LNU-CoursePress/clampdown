/**
 This is a global configuration file for the express framework
 */
"use strict";

var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");             // log requests to the console (express4)
var methodOverride = require("method-override"); // simulate DELETE and PUT (express4)
var compression = require("compression");
var path = require("path");
var config = require("./environment");
var exphbs = require("express-handlebars");
var cors = require("cors");

module.exports = function(app) {
    var env = app.get("env");

    // Configure the handlebar
    app.engine(".html", exphbs({defaultLayout: "home", extname: ".html"}));
    app.set("view engine", ".html");

    app.use(compression());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cors());

    // override with POST having ?_method=DELETE
    app.use(methodOverride("_method"));

    if (env === "production") {
        app.use(express.static(path.join(config.root, "public")));
        app.set("appPath", config.root + "/public");
        app.use(morgan("tiny"));
    }

    if (env === "development" || env === "test") {
        app.use(express.static(path.join(config.root, ".tmp")));
        app.use(express.static(path.join(config.root, "client")));
        app.use(morgan("dev"));
    }
};