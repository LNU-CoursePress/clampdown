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

describe("# Students API", function() {


    describe("### /api/students", function() {

        it("should list all the students", function(done) {
            superagent
            .get(URL +"/students")
            .set("Accept", "application/json")
            .set("Authorization", keys.APIReadKey)
            .end(function(err, response) {

                should.not.exist(err);
                should.equal(response.status, 200);
                response.header.should.have.property("content-type").to.contain("application/json");
                var result = response.body;
                expect(result).to.have.length.above(2);

                // Is this stupid - the data should already been tested in unit tests
                var obj1 = {
                    username: "thajostudent",
                    firstname: "John",
                    lastname: "Häggerud",
                    studentType: "Campus",
                    services: {
                        github: "thajo"
                    }
                };
                delete result[0].created;
                expect(result[0]).to.eql(obj1);

                var obj2 = {
                    username: "tstjo",
                    firstname: "Johan",
                    lastname: "Leitet",
                    studentType: "Distance",
                    services: {
                        github: "leitet",
                        linkedin: "leitet"
                    }
                };
                delete result[1].created;
                expect(result[1]).to.eql(obj2);
                done();
            });
        });

        it("should return an empty array if no students", function(done) {
            var Student = require("../../../../api/student/student.schema.js").Student;
            Student.remove({}, function() {
                superagent
                    .get(URL +"/students")
                    .set("Accept", "application/json")
                    .set("Authorization", keys.APIReadKey)
                    .end(function(err, res) {
                        expect(res.body).to.be.empty;
                        should.equal(res.status, 200);
                        done();
                    });
            });

        });
    });


    describe("### /students - Post/Create", function() {

        it("Should create a new student", function(done) {
            var newStudent = {
                username: "mats",
                firstname: "Mats",
                lastname: "Loock",
                studentType: "Campus",
                services: {
                    github: "mtslck"
                }
            };
           superagent.post(URL +"/students")
               .set("Content-Type", "application/json")
               .set("Accept", "application/json")
               .set("Authorization", keys.APIWriteKey)
               .send(newStudent)
               .end(function(err, res) {
                   should.equal(res.status, 201);

                   done();
               });
        });

        it("Should create a new student adding skype", function(done) {
            var newStudent = {
                username: "mats",
                firstname: "Mats",
                lastname: "Loock",
                studentType: "Campus",
                services: {
                    github: "mtslck",
                    skype: "masse"
                }
            };
            superagent.post(URL +"/students")
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", keys.APIWriteKey)
                .send(newStudent)
                .end(function(err, res) {
                    should.equal(res.status, 201);

                    done();
                });
        });

        it("Should fail to create student with taken username", function(done) {
            var newStudent = {
                username: "thajostudent",
                firstname: "Mats",
                lastname: "Loock",
                studentType: "Campus",
                services: {
                    github: "mtslck"
                }
            };
            superagent.post(URL +"/students")
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", keys.APIWriteKey)
                .send(newStudent)
                .end(function(error, response) {
                    should.equal(response.status, 400);
                    should.exist(error); // the error from superagent
                    expect(response.body.errorMessage).to.contain(Messages.eng.create.usernameTaken);
                    done();
                });
        });

        it("Should fail to create student when no data provided", function(done) {
            superagent.post(URL +"/students")
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", keys.APIWriteKey)
                .send()
                .end(function(error, response) {
                    should.equal(response.status, 400);
                    should.exist(error); // the error from superagent
                    //expect(response.body.errorMessage).to.contain("Student validation failed");
                    done();
                });
        });
    });

    describe("### /students - Patch/Update", function() {

       it("Should update a existing student", function(done) {
            var newStudent = {
                username: "thajostudent",
                firstname: "Mats",
                lastname: "Loock",
                studentType: "Campus",
                services: {
                    github: "mtslck"
                }
            };
            superagent.patch(URL +"/students/" +newStudent.username)
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", keys.APIWriteKey)
                .send(newStudent)
                .end(function(err, res) {
                    should.equal(res.status, 200);

                    done();
                });
        });

       it("Should fail to update a non existing student", function(done) {
            var newStudent = {
                username: "xxxxxx",
                firstname: "Mats",
                lastname: "Loock",
                studentType: "Campus",
                services: {
                    github: "mtslck"
                }
            };
           superagent.patch(URL +"/students/" +newStudent.username)
               .set("Content-Type", "application/json")
               .set("Accept", "application/json")
               .set("Authorization", keys.APIWriteKey)
                .send(newStudent)
                .end(function(error, response) {
                    should.equal(response.status, 404);
                    should.exist(error); // the error from superagent
                    expect(response.body.errorMessage).to.contain(Messages.eng.update.usernameNotFound);
                    done();
                });
        });

    });

    describe("### /students/:username - Delete", function() {

        it("Should delete a user", function(done) {
           superagent.del(URL +"/students/thajostudent")
               .set("Content-Type", "application/json")
               .set("Accept", "application/json")
               .set("Authorization", keys.APIWriteKey)
               .send()
               .end(function(err, res) {
                   should.equal(res.status, 204);
                   done();
               });
       });

        it("Should give a 204 if trying to delete a non existing user", function(done) {
            superagent.del(URL +"/students/saasdasdasd")
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", keys.APIWriteKey)
                .send()
                .end(function(err, res) {
                    should.equal(res.status, 204);
                    done();
                });
        });
    });

    describe("### /students/:username - Get", function() {

       it("Should get a single student", function(done) {
           var correct = {
               username: "thajostudent",
               firstname: "John",
               lastname: "Häggerud",
               studentType: "Campus",
               services: {
                   github: "thajo"
               }
           };
           superagent
               .get(URL +"/students/thajostudent")

               .set("Content-Type", "application/json")
               .set("Accept", "application/json")
               .set("Authorization", keys.APIReadKey)
               .end(function(err, response) {

                   should.not.exist(err);
                   expect(response.status).to.eql(200);

                   done();
               });
       });

       it("Should get a Not Found on a bad url", function(done) {

            superagent
                .get(URL +"/students/xxxxx")
                .set("Accept", "application/json")
                .set("Authorization", keys.APIReadKey)
                .end(function(err, response) {
                    should.exist(err);
                    expect(response.status).to.eql(404);
                    done();
                });
        });

    });

    describe("### Should not be allowed", function() {

        it("Should get a 401 back if no Authorization header is present", function(done) {
            superagent
                .get(URL +"/students")
                .set("Accept", "application/json")
                .end(function(err, response) {
                    should.exist(err);
                    expect(response.status).to.eql(401);
                    done();
                });
        });

        it("Should get a 401 back if wrong Authorization header is present", function(done) {
            superagent
                .get(URL +"/students")
                .set("Accept", "application/json")
                .set("Authorization", "aslkdfhjsdjhfjkshdfkjhsdk")
                .end(function(err, response) {
                    should.exist(err);
                    expect(response.status).to.eql(401);
                    done();
                });
        });

        it("Should get a 401 back if trying to POST with readkey", function(done) {
            var newStudent = {
                username: "mats",
                firstname: "Mats",
                lastname: "Loock",
                studentType: "Campus",
                services: {
                    github: "mtslck"
                },
                startYear: new Date("2014").getFullYear()
            };
            superagent.post(URL +"/students")
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", keys.APIReadKey)
                .send(newStudent)
                .end(function(err, res) {
                    should.equal(res.status, 401);
                    done();
                });
        });

        it("Should get a 401 back if trying to PATCH with readkey", function(done) {
            var newStudent = {
                username: "thajostudent",
                firstname: "Mats",
                lastname: "Loock",
                studentType: "Campus",
                services: {
                    github: "mtslck"
                },
                startYear: new Date("2014").getFullYear()
            };
            superagent.patch(URL +"/students/" +newStudent.username)
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", keys.APIReadKey)
                .send(newStudent)
                .end(function(err, res) {
                    should.equal(res.status, 401);
                    done();
                });
        });

        it("Should get a 401 back if trying to DELETE with readkey", function(done) {

            superagent.del(URL +"/students/thajostudent")
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", keys.APIReadKey)
                .end(function(err, res) {
                    should.equal(res.status, 401);
                    done();
                });
        });

    });

    // TODO: Write test for deleteing

});
