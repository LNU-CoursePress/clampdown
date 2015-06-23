/*jshint expr: true */
'use strict';



// import the moongoose helper utilities
require('../../../utils');


var server = require('../../../../app.js');
var should = require('chai').should();
var expect = require('chai').expect;
var superagent = require('superagent');
var URL = 'http://localhost:3000/api';

var Messages = require('../../../../api/student/student.Strings.js').Messages;

describe('# Students API', function() {


    var app;

    before(function() {
        app = server;
    });

    after(function() {
        server.close();
    });

    describe('### /api/students', function() {
        it('should list all the students', function(done) {
            superagent
            .get(URL +'/students')
            .set('Accept', 'application/json')
            .end(function(err, response) {

                should.not.exist(err);
                should.equal(response.status, 200);
                response.header.should.have.property('content-type').to.contain('application/json');
                //    console.log(response);
                var result = response.body;

                should.equal(result.length, 2);

                // Is this stupid - the data should already been tested in unit tests
                var obj1 = {
                    username: 'thajostudent',
                    firstname: 'John',
                    lastname: 'Häggerud',
                    studentType: 'Campus',
                    services: {
                        github: 'thajo'
                    },
                    startYear: new Date('2013').getFullYear()
                };

                expect(result[0]).to.eql(obj1);

                var obj2 = {
                    username: 'tstjo',
                    firstname: 'Johan',
                    lastname: 'Leitet',
                    studentType: 'Distance',
                    services: {
                        github: 'leitet',
                        linkedIn: 'leitet'
                    },
                    startYear: new Date('2013').getFullYear()
                };

                expect(result[1]).to.eql(obj2);
                done();
            });
        });


        it('should return an empty array if no students', function(done) {
            var Student = require('../../../../api/student/student.schema.js').Student;
            Student.remove({}, function() {
                superagent
                    .get(URL +'/students')
                    .set('Accept', 'application/json')
                    .end(function(err, res) {
                        expect(res.body).to.be.empty;
                        should.equal(res.status, 200);
                        done();
                    });
            });

        });
    });


    describe('### /students - Post/Create', function() {
        it('Should create a new student', function(done) {
            var newStudent = {
                username: 'mats',
                firstname: 'Mats',
                lastname: 'Loock',
                studentType: 'Campus',
                services: {
                    github: 'mtslck'
                },
                startYear: new Date('2014').getFullYear()
            };
           superagent.post(URL +'/students')
               .set('Content-Type', 'application/json')
               .set('Accept', 'application/json')
               .send(newStudent)
               .end(function(err, res) {
                   should.equal(res.status, 201);
                   expect(res.body).to.eql(newStudent);
                   done();
               });
        });

        it('Should fail to create student with taken username', function(done) {
            var newStudent = {
                username: 'thajostudent',
                firstname: 'Mats',
                lastname: 'Loock',
                studentType: 'Campus',
                services: {
                    github: 'mtslck'
                },
                startYear: new Date('2014').getFullYear()
            };
            superagent.post(URL +'/students')
                .send(newStudent)
                .end(function(error, response) {
                    should.equal(response.status, 400);
                    should.exist(error); // the error from superagent
                    expect(response.body.errorMessage).to.contain(Messages.eng.create.usernameTaken);
                    done();
                });
        });

        it('Should fail to create student when no data provided', function(done) {
            superagent.post(URL +'/students')
                .end(function(error, response) {
                    should.equal(response.status, 400);
                    should.exist(error); // the error from superagent
                    expect(response.body.errorMessage).to.contain('Student validation failed');
                    done();
                });
        });
    });

    describe('### /students - Patch/Update', function() {
        it('Should update a existing student', function(done) {
            var newStudent = {
                username: 'thajostudent',
                firstname: 'Mats',
                lastname: 'Loock',
                studentType: 'Campus',
                services: {
                    github: 'mtslck'
                },
                startYear: new Date('2014').getFullYear()
            };
            superagent.patch(URL +'/students/' +newStudent.username)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(newStudent)
                .end(function(err, res) {
                    should.equal(res.status, 200);
                    expect(res.body).to.eql(newStudent);
                    done();
                });
        });

       it('Should fail to update a non existing student', function(done) {
            var newStudent = {
                username: 'xxxxxx',
                firstname: 'Mats',
                lastname: 'Loock',
                studentType: 'Campus',
                services: {
                    github: 'mtslck'
                },
                startYear: new Date('2014').getFullYear()
            };
           superagent.patch(URL +'/students/' +newStudent.username)
                .send(newStudent)
                .end(function(error, response) {
                    should.equal(response.status, 404);
                    should.exist(error); // the error from superagent
                    expect(response.body.errorMessage).to.contain(Messages.eng.update.usernameNotFound);
                    done();
                });
        });

         /* it('Should fail to update with no correct data', function(done) {

              var newStudent = {
                  username: 'thajostudent',
                  firstname: 'Mats',
                  lastxcname: 'Loock',
                  studedfntType: 'Campus',
                  servicefs: {
                      github: 'mtslck'
                  },
                  startYear: new Date('2014').getFullYear()
              };

              superagent.patch(URL +'/students/thajostudent')
                  .send(newStudent)
                .end(function(error, response) {
                    should.equal(response.status, 400);
                    should.exist(error); // the error from superagent

                    done();
                });
        });*/
    });

});
