/*jshint expr: true */
'use strict';

/**
 * This test suit should only test the model stuff
 *      - CRUD operations against the db
 *      - Validation for unsafe data methods
 *      - Checking the data structure betwwen db and layers above
 */

// import the moongoose helper utilities
require('../../utils');

var should = require('chai').should();
var expect = require('chai').expect;

describe('# Students: model - Unit tests', function () {

    var Student = require('../../../api/student/student.model');
    var Messages = require('../../../api/student/student.Strings.js').Messages;


    describe('### Create Students', function() {
       it('should create a student', function(done) {


           var mockObject = {
               username: 'mats',
               firstname: 'Mats',
               lastname: 'Loock',
               studentType: 'Distance',
               services: {
                   github: 'mtslck',
                   twitter: 'mats'
               },
               startYear: new Date().getFullYear()
           };

           Student.createStudent(mockObject, function(err, result) {
               if(err) {
                   console.log(err);
               }
               // Confirm that that an error does not exist
               should.not.exist(err);

               expect(result).to.eql(mockObject);
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

        it('should return error, trying to create with same githubname', function(done) {


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

            Student.createStudent(mockObject, function(err) {

                // Confirm that that an error does not exist
                should.exist(err);
                expect(err.toString()).to.eql('MongoError: E11000 duplicate key error index: testDB.students.$services.github_1  dup key: { : "thajo" }');

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


    describe('### List students', function () {
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


    describe('### Show single student', function () {
        it('should show the user provided by username', function (done) {
            // Create a User object to pass to User.create()

            Student.showStudent('thajostudent', function (err, result) {
                // Confirm that that an error does not exist
                should.not.exist(err);

                // verify that the returned user is what we expect
                result.should.be.instanceof(Object);
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

                expect(result).to.eql(obj1);

                done();
            });
        });

        it('should return an error when no user i found', function (done) {
            // Create a User object to pass to User.create()

            Student.showStudent('xxxxxxx', function (err) {

                should.exist(err);

                err.should.be.instanceof(Error);
                expect(err.message).to.eql(Messages.eng.show.usernameNotFound);

                done();
            });
        });

        it('should return an error when no username provided', function (done) {
            // Create a User object to pass to User.create()

            Student.showStudent(null, function (err, result) {

                should.exist(err);
                should.not.exist(result);
                err.should.be.instanceof(Error);
                expect(err.message).to.eql(Messages.eng.show.usernameNotFound);

                done();
            });
        });

    });


    describe('### Update Student', function() {

        it('should update a student', function(done) {
            var mockObject = {
                username: 'thajostudent',
                firstname: 'John',
                lastname: 'Loock',
                studentType: 'Distance',
                startYear: new Date().getFullYear(),
                services: {
                    github: 'mtslk'
                }
            };

            Student.updateStudent('thajostudent', mockObject, function(err, result) {


                // Confirm that that an error does not exist
                should.not.exist(err);
                expect(result).to.eql(mockObject);
                // Call done to tell mocha that we are done with this test

                Student.showStudent('thajostudent', function(err, response) {

                    should.not.exist(err);
                   // expect(response).to.eql(mockObject);
                    done();
                });


            });
        });

        it('should fail to update a student with wrong username', function(done) {
            var mockObject = {};
            Student.updateStudent('xxxxxx', mockObject, function(err) {
               // console.log(err);
                // Confirm that that an error does not exist
                should.exist(err);
                expect(err.message).to.eql(Messages.eng.update.usernameNotFound);
                done();

            });
        });

        it('should fail to update a student with empty object', function(done) {
            var mockObject = {};
            var orginal = {
                username: 'thajostudent',
                firstname: 'John',
                lastname: 'Häggerud',
                studentType: 'Campus',
                startYear: new Date('2013').getFullYear(),
                services: {
                    github: 'thajo'
                }
            };
            var testUser = 'thajostudent';
            Student.updateStudent(testUser, mockObject, function(err, response) {

                should.not.exist(err);
                expect(orginal).to.eql(response);// the model will return the old object (not changed)
                done();
            });
        });




        it('should fail to update a student with occupide username', function(done) {
            var mockObject = {
                username: 'thajoStudent',
                firstname: 'John',
                lastname: 'Häggerud',
                studentType: 'Campus',
                services: {
                    github: 'thajo'
                },
                startYear: new Date('2013').getFullYear()
            };
            var testUser = 'tstjo';
            Student.updateStudent(testUser, mockObject, function(err) {

                should.exist(err); // the model will return the old object (not changed)
                expect(err.toString()).to.eql('MongoError: exception: E11000 duplicate key error index: testDB.students.$services.github_1  dup key: { : "thajo" }');
                done();
            });
        });

        it('Should fail to update with bad propities name', function(done) {
            var mock = {
                username: 'thajostudent',
                firstname: 'Simone',
                xxxlastname: 'Loock',
                xxxstudentType: 'Campvdgus',
                xxservicefsdfsdfs: {
                    github: 'mtslck'
                },
                startYear: new Date('2014').getFullYear()
            };


            var correct =  {
                username: 'thajostudent',
                firstname: 'Simone',
                lastname: 'Häggerud',
                studentType: 'Campus',
                startYear: new Date('2014').getFullYear(),
                services: {
                    github: 'thajo'
                }
            };

            Student.updateStudent('thajostudent', mock, function(err, result) {

                should.not.exist(err); // the model will return the old object (not changed)
                expect(correct).to.eql(result);
                done();
            });
        });

        it('Should update only the provided properties', function(done) {
            var mock = {
                username: 'thajostudent',
                lastname: 'Haeggerud',
                services: {
                    github: 'mtslck',
                    twitter: 'thajo'
                }
            };

            var answer = {
                username: 'thajostudent',
                firstname: 'John',
                lastname: 'Haeggerud',
                studentType: 'Campus',
                services: {
                    github: 'mtslck',
                    twitter: 'thajo'
                },
                startYear: new Date('2013').getFullYear()
            };
            Student.updateStudent('thajostudent', mock, function(err, response) {

                should.not.exist(err); // the model will return the old object (not changed)

                expect(response).to.eql(answer);
                done();
            });
        });

    });


    describe('### Delete student', function() {
        it('should delete a specific student', function(done) {
           Student.deleteStudent('thajostudent', function(err, result) {
               // Confirm that that an error does not exist
               should.not.exist(err);

               expect(result).to.eql(Messages.eng.delete.success);
               // Call done to tell mocha that we are done with this test

               Student.showStudent('thajostudent', function(err, result) {
                   should.exist(err);
                   err.should.be.instanceof(Error);
                   expect(err.message).to.eql(Messages.eng.show.usernameNotFound);
                   done();
               });


           });
        });

        it('should NOT give an error (indempotent) if trying to delete a user that doesnt exist', function(done) {
            Student.deleteStudent('xxxxxx', function(err) {
                // Confirm that that an error does not exist
                should.not.exist(err);

              //  expect(err.message).to.eql(Messages.eng.delete.usernameNotFound);
                // Call done to tell mocha that we are done with this test
                done();
            });
        });

    });


});

