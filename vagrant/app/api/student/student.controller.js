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
    var schoolName = req.body.username;
    var githubName = req.body.githubName;

    if(!schoolName || !githubName || schoolName.length < 1 || githubName.length < 1) {
        return respondTo(req, res, {error: 'Didn\'t provide correctly'}, 'index');
    }
    Student.saveStudent(schoolName, githubName, function(err, result) {
        if(err) {
            console.log('Error: %s, Student: %s', err, result);
        }
        return redirectTo(req, res, 201, '/thanx');
    });
};

exports.show = function(req, res) {
    Student.listStudents(function(err, students) {
        if(err) {
            console.log("Error from getting a list of students");
        }
       respondTo(req, res, {students: students}, 'students');
    });
};

exports.delete = function(req, res) {
    var username = req.params.username;
    Student.deleteStudent(username, function(err, result) {
        if(err) {
            return redirectTo(req, res, 500);
        }
        if(!result) {
            // tried to remova a post that doesnt exists
            return redirectTo(req, res, 404);
        }
        redirectTo(req, res, 204, '/students');
    });
};

exports.update = function(req, res) {
    var username = req.params.username; // ake this from the URL a la RESTful
    var githubName = req.body.githubName;

    Student.updateGithubUsername(username, githubName, function(err) {
        if(err) {
            console.log(err);
        }
        redirectTo(req, res, 204, '/students');
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

function redirectTo(req, res, code, url) {
    if(wantJSON(req)) {
        return res.sendStatus(code);
    }
    return res.redirect(url);
}

function respondTo(req, res, data, template) {
    if(wantJSON(req)) {
        return res.send(JSON.stringify(data));
    }
    return res.render(template, data);
}

