/*jshint expr: true */
"use strict";

/**
 * This is the integration test suit responsible for
 *      - Routing
 *      - Status codes
 *      - HTTP Headers
 *      - Geting data for REST service
 */

// import the moongoose helper utilities
require("../../../utils");

var server = require("../../../../app.js");
var should = require("chai").should();
var expect = require("chai").expect;
var superagent = require("superagent");
var URL = "http://localhost:3000/api";

var keys = require("../../../../config/environment").secrets;

var Messages = require("../../../../api/student/student.Strings.js").Messages;

describe("# Filtering - Students API", function() {



    describe("### Filtering /api/students", function() {

        it("should list just the students depending on class-querystring", function(done) {
            done();
        });

    });

});
