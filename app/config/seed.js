/**
 * Created by thajo on 26/05/15.
 * Use this file for populate the db
 */
"use strict";

exports.seed = function(callback) {
    var Student = require("../api/student/student.schema.js").Student;
    Student.remove({}, function(err) {
        if (err) {
            console.log(err);
            return callback(err);
        }
        else {
            Student.create(
                {
                    username: "thajo",
                    firstname: "John",
                    lastname: "Häggerud",
                    studentType: "campus",
                    city: "Kalmar",
                    services: {
                        github: "thajo"
                    },
                    program: "staff"
                },
                {
                    username: "tstjo",
                    firstname: "Johan",
                    lastname: "Leitet",
                    studentType: "distance",
                    program: "staff",
                    city: "kalmar",
                    services: {
                        github: "leitet",
                        linkedin: "leitet"
                    }
                },
                {
                    username: "ttoda",
                    firstname: "Daniel",
                    lastname: "Toll",
                    studentType: "campus",
                    city: "KaLmaR",
                    services: {
                        github: "dtoll"
                    },
                    program: "WP2015"
                },
                {
                    username: "tohto",
                    firstname: "Tobias",
                    lastname: "Ohlsson",
                    studentType: "distance",
                    program: "UDM2015",
                    services: {
                        github: "hobbe",
                        linkedin: "hobbe"
                    }
                },
                {
                    username: "mats",
                    firstname: "Mats",
                    lastname: "Loock",
                    studentType: "distance",
                    services: {
                        github: "mtslck"
                    },
                    program: "WP2015"
                },
                function(err) {
                    if (err) {
                        console.log(err);
                        return callback(err);
                    }

                    callback();
                });
        }
    });

};