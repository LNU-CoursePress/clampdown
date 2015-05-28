/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';




exports.seed = function(callback) {
    var Student = require('../api/student/student.schema.js').Student;
    Student.remove({}, function() {

        Student.create(
            {username: 'thajo', githubName: 'thajo'},
            {username: 'tstjo', githubName: 'leitet'},
            {username: 'mats', githubName: 'mtslck'},
            function() {
                console.log('finished populating students');
                callback();
            }
        );

    });

};

