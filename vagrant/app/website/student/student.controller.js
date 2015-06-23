/**
 * Using Rails-like standard naming convention for endpoints.
 * POST   /students             ->  create - Create a student in the db
 * ...
 */

'use strict';
var Student = require('./student.model');
var TYPE_JSON = 'application/json';

exports.create = function(req, res) {
    // Works as POSTDATA and json


    if(!req.body) {
        return respondTo(req, res, {error: 'Didn\'t provide an object'}, 'index');
    }

    Student.createStudent(req.body, function(err, result) {
        if(err) {
            console.log('Error: %s, Student: %s', err, result);
        }
        return respondTo(req, res, 201, result, '/thanx');
    });
};

exports.show = function(req, res) {
    Student.listStudents(function(err, students) {
        if(err) {
            console.log("Error from getting a list of students");
        }
       respondTo(req, res, 200, {students: students}, 'students');
    });
};

exports.delete = function(req, res) {
    var username = req.params.username;
    Student.deleteStudent(username, function(err, result) {
        if(err) {
            return respondTo(req, res, 500);
        }
        if(!result) {
            // tried to remova a post that doesnt exists
            return respondTo(req, res, 404);
        }
        respondTo(req, res, 204, '/students');
    });
};

exports.update = function(req, res) {
    var username = req.params.username; // ake this from the URL a la RESTful
    var githubName = req.body.githubName;

    Student.updateGithubUsername(username, githubName, function(err) {
        if(err) {
            console.log(err);
        }
        respondTo(req, res, 204, '/students');
    });
};


/**
 * Private helper function
 * Check if the user want the answer in json format
 * @param req - The request object from express
 * @returns {boolean} -
 */
function wantJSON(req) {
    return req.get('Accept') === TYPE_JSON;
}

/*
function redirectTo(req, res, code, url, data) {
    if(wantJSON(req)) {
        res.statusCode = code;
        res.setHeader("Content-Type", "application/json");
        return res.send(JSON.stringify(data));
    }
    return res.redirect(url);
}
*/
function respondTo(req, res, code, data, template, url) {
    res.statusCode = code;
    if(wantJSON(req)) {
        res.setHeader("Content-Type", "application/json");
        return res.send(JSON.stringify(data));
    }
    if(url) {
        return res.redirect(url);
    }
    return res.render(template, data);
}

