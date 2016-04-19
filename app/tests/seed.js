/**
 * Populate DB with sample test data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
var debug = require("debug")("test-seed");

exports.seed = function(callback) {
    var Student = require('../api/student/student.schema.js').Student;
    Student.remove({}, function() {

        Student.create(
            {
                username: 'thajostudent',
                firstname: 'John',
                lastname: 'Häggerud',
                studentType: 'Campus',
                city: "Kalmar",
                startYear: new Date('2013').getFullYear(),
                services: {
                    github: 'thajo'
                }
            },
            {
                username: 'tstjo',
                firstname: 'Johan',
                lastname: 'Leitet',
                city: "kalmar",
                studentType: 'campus',
                startYear: new Date('2013').getFullYear(),
                services: {
                    github: 'leitet',
                    linkedin: 'leitet'
                }
            },
            {
                username: 'xx222xx',
                firstname: 'Ellen',
                lastname: 'Nu',
                city: "KaLmaR",
                studentType: 'distance',
                program: 'WP2015',
                services: {
                    github: 'rkrkrk'
                }
            },
            {
                username: 'yy222yy',
                firstname: 'Kalle',
                lastname: 'Kula',
                studentType: 'Campus',
                program: 'WP2015',
                services: {
                    github: 'kkxxxxxx'
                }
            },
            {
                username: 'zz222zz',
                firstname: 'Kalle',
                lastname: 'Kula',
                studentType: 'Campus',
                program: 'UDM2015',
                services: {
                    github: 'xxxxxx'
                }
            },
            function() {
                debug(' TEST : finished populating students');
                callback();
            }
        );

    });

};

