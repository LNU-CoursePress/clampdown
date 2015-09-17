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
            superagent
                .get(URL +"/students")
                .set("Accept", "application/json")
                .set("Authorization", keys.APIReadKey)
                .end(function(err, response) {
                    should.not.exist(err);
                    should.equal(response.status, 200);
                    response.header.should.have.property("content-type").to.contain("application/json");
                    var result = response.body;
                    expect(result).to.have.length.above(0);
                    expect(result[0].username).to.equal("xx222xx");
                    done();
                });
        });

    });

});
