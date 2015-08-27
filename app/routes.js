/**
 * Main application routes
 */
"use strict";

module.exports = function(app) {
    app.use("/", require("./api/student"));
    app.use("/", require("./api/github"));
};
