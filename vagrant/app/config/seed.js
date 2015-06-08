/**
 * Created by thajo on 26/05/15.
 * Use this file for populate the db
 */
'use strict';




exports.seed = function() {
    var Student = require('../api/student/student.schema.js').Student;
    Student.remove({}, function() {

        Student.create(
            {
                username: 'thajostudent',
                firstname: 'John',
                lastname: 'Häggerud',
                studentType: 'Campus',
                startYear: new Date(),
                services: {
                    github: 'thajo'
                }
            },
            {
                username: 'tstjo',
                firstname: 'Johan',
                lastname: 'Leitet',
                studentType: 'Distance',
                startYear: new Date(),
                services: {
                    github: 'leitet',
                    linkedIn: 'leitet'
                }
            },
            function() {
                console.log('finished seeding students');
                //callback();
            }
        );

    });

};