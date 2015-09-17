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

   /* after(function() {
        server.close();
    });*/

    describe("### Filtering /api/students", function() {

        it("should list just the students depending on class-querystring", function(done) {
            superagent
                .get(URL +"/students?program=WP2015")
                .set("Accept", "application/json")
                .set("Authorization", keys.APIReadKey)
                .end(function(err, response) {
                    should.not.exist(err);
                    should.equal(response.status, 200);
                    response.header.should.have.property("content-type").to.contain("application/json");
                    var result = response.body;

                    expect(result).to.have.length.above(1); // should be 2
                    expect(result[0].username).to.equal("xx222xx");
                    done();
                });
        });

        it("should list just the students depending on studentType-querystring", function(done) {
            superagent
                .get(URL +"/students?studentType=distance")
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

        it("should list just the students depending on programANDstudentType-querystring", function(done) {
            superagent
                .get(URL +"/students?studentType=campus&program=WP2015")
                .set("Accept", "application/json")
                .set("Authorization", keys.APIReadKey)
                .end(function(err, response) {
                    should.not.exist(err);
                    should.equal(response.status, 200);
                    response.header.should.have.property("content-type").to.contain("application/json");
                    var result = response.body;

                    expect(result).to.have.length.above(0);
                    expect(result[0].username).to.equal("yy222yy");
                    done();
                });
        });

    });

    describe("### Bad calls Filtering /api/students", function() {

        it("should return an empty array if querystring is not found", function(done) {
            superagent
                .get(URL +"/students?program=dsfsdfsdf")
                .set("Accept", "application/json")
                .set("Authorization", keys.APIReadKey)
                .end(function(err, response) {
                    should.not.exist(err);
                    should.equal(response.status, 200);
                    response.header.should.have.property("content-type").to.contain("application/json");
                    var result = response.body;

                    expect(result).to.be.an.instanceof(Array); // should be 2
                    expect(result).to.be.empty;
                    done();
                });
        });

        it("should return an empty array if key in querystring is not found", function(done) {
            superagent
                .get(URL +"/students?sdfsdfsdf=dsfsdfsdf")
                .set("Accept", "application/json")
                .set("Authorization", keys.APIReadKey)
                .end(function(err, response) {
                    should.not.exist(err);
                    should.equal(response.status, 200);
                    response.header.should.have.property("content-type").to.contain("application/json");
                    var result = response.body;

                    expect(result).to.be.an.instanceof(Array); // should be 2
                    expect(result).to.be.empty;
                    done();
                });
        });



    });

});
