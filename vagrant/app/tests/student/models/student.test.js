/*jshint expr: true */
'use strict';



// import the moongoose helper utilities
require('../../utils');

var should = require('chai').should();
var expect = require('chai').expect;

describe('Students: model', function () {

    var Student = require('../../../api/student/student.model');
    var Messages = require('../../../api/student/student.Strings.js').Messages;


    describe('### Create Students', function() {
       it('should create a student', function(done) {


           var mockObject = {
               username: 'thajo',
               firstname: 'John',
               lastname: 'Häggerud',
               studentType: 'Campus',
               startYear: new Date().getFullYear(),
               services: {
                   github: 'thajo'
               }
           };

           Student.createStudent(mockObject, function(err, result) {
               // Confirm that that an error does not exist
               should.not.exist(err);
               result.should.be.instanceof(Object).have.property('username');
               // Call done to tell mocha that we are done with this test
               done();
           });
       });

        it('should return error, trying to create with same username', function(done) {
            var mockObject = {
                username: 'thajostudent',
                firstname: 'John',
                lastname: 'Häggerud',
                studentType: 'Campus',
                startYear: new Date().getFullYear(),
                services: {
                    github: 'thajo'
                }
            };

            Student.createStudent(mockObject, function(err, result) {
                // Confirm that that an error does not exist
                should.exist(err);
                should.not.exist(result);
                err.should.be.instanceof(Error);
                expect(err.message).to.eql(Messages.eng.create.usernameTaken);
                // Call done to tell mocha that we are done with this test
                done();
            });
        });

        it('should return required validation error, trying to create with empty object', function(done) {
            var mockObject = {};

            Student.createStudent(mockObject, function(err, result) {
                // Confirm that that an error does not exist
                should.exist(err);
                should.not.exist(result);
                err.should.be.instanceof(Error);
                expect(err.toString()).to.eql('ValidationError: Path `services.github` is required., Path `studentType` is required., Path `username` is required., Path `lastname` is required., Path `firstname` is required.');
                done();
            });
        });

        it('should return validation error, trying to populate enums with bad values', function(done) {
            var mockObject = {
                username: 'xxxxx',
                firstname: 'John',
                lastname: 'Häggerud',
                studentType: 'hittepå',
                startYear: new Date().getFullYear(),
                services: {
                    github: 'thajo'
                }
            };

            Student.createStudent(mockObject, function(err, result) {
                // Confirm that that an error does not exist
                should.exist(err);
                should.not.exist(result);
                err.should.be.instanceof(Error);
                expect(err.toString()).to.eql('ValidationError: `hittepå` is not a valid enum value for path `studentType`.');
                done();
            });
        });
    });

    describe('#list()', function () {
        it('should list users in the application', function (done) {
            // Create a User object to pass to User.create()

            Student.listStudents(function (err, result) {
                // Confirm that that an error does not exist
                should.not.exist(err);

                // verify that the returned user is what we expect
                result.should.be.instanceof(Array).and.have.lengthOf(2);

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

    });

    /*
    describe('#find student', function() {
        it('should show a specific user', function(done) {
           Student.showStudent('mats', function(err, result) {
               // Confirm that that an error does not exist
               should.not.exist(err);

               result.should.be.instanceof(Object).have.property('githubName');
               // Call done to tell mocha that we are done with this test
               done();
           });
        });

        it('should return a empty object if user not found', function(done) {
            Student.showStudent('thajoxxx', function(err, result) {
                // Confirm that that an error does not exist
                should.not.exist(err);

                expect(result).to.be.null;
                // Call done to tell mocha that we are done with this test
                done();
            });
        });

        it('should return a empty object if user not provided', function(done) {
            Student.showStudent('', function(err, result) {
                // Confirm that that an error does not exist
                should.not.exist(err);

                expect(result).to.be.null;
                // Call done to tell mocha that we are done with this test
                done();
            });
        });

        it('should return a correct object of the student', function(done) {
            Student.showStudent('tstjo', function(err, result) {
                // Confirm that that an error does not exist
                should.not.exist(err);

                var correct = JSON.parse(JSON.stringify({username: 'tstjo', githubName: 'leitet'}));
                expect(result).to.eql(correct); // deeply equal to value.
                // Call done to tell mocha that we are done with this test
                done();
            });
        });
    });


    */


});

