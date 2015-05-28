'use strict';

// import the moongoose helper utilities
require('../../utils');



describe('Users: models', function () {

    var Student = require('../../../api/student/student.model');


    describe('#list()', function () {
        it('should list users', function (done) {
            // Create a User object to pass to User.create()

            Student.listStudents(function (err, result) {
                console.log("The result of students: ", result);
                // Confirm that that an error does not exist
               // should.not.exist(err);
                // verify that the returned user is what we expect
               // result.should.be.instanceof(Array).and.have.lengthOf(3);
                // Call done to tell mocha that we are done with this test
                console.log("Return done...");
                done();
            });
        });

    });

});

