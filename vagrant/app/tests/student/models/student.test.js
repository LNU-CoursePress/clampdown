/*jshint expr: true */
'use strict';



// import the moongoose helper utilities
require('../../utils');

var should = require('chai').should();
var expect = require('chai').expect;

describe('Users: models', function () {

    var Student = require('../../../api/student/student.model');


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


    describe('#list()', function () {
        it('should list users', function (done) {
            // Create a User object to pass to User.create()

            Student.listStudents(function (err, result) {
                // Confirm that that an error does not exist
                should.not.exist(err);

                // verify that the returned user is what we expect
                result.should.be.instanceof(Array).and.have.lengthOf(3);

                result[0].githubName.should.equal('thajo');
                var l = result.length;
                result[l-1].username.should.equal('mats');

                done();
            });
        });

    });

});

