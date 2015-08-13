/**
 * Using Rails-like standard naming convention for endpoints.
 * POST   /students             ->  create - Create a student in the db
 * ...
 */

'use strict';
var Student = require('./student.model');
var Messages = require('./student.Strings.js').Messages;

exports.create = function(req, res) {
    Student.createStudent(req.body, function(err, result) {
        if(err) {

            return respondTo(err, res, null, 400);
        }
        return respondTo(null, res, result, 201);

    });
};

exports.show = function(req, res) {
    var username = req.params.username; // ake this from the URL a la RESTful
    Student.showStudent(username, function (err, result) {
       if(err) {
           return respondTo(err, res, null, 404);
       }
       return respondTo(null, res, result, 200);
    });
};

exports.list = function(req, res) {
    Student.listStudents(function(err, students) {
        if(err) {
            respondTo(new Error('could not connect to DB'), res, null, 500);
        }
        respondTo(null, res, students, 200);
    });
};

exports.delete = function(req, res) {
    var username = req.params.username;
    Student.deleteStudent(username, function(err) {
        if(err) {
            return respondTo(err, res, null, 500);
        }
        // if the post dont exist its all good
        return respondTo(null, res, null, 204);
    });
};

exports.update = function(req, res) {
    var username = req.params.username; // ake this from the URL a la RESTful
    var updateingStudent = req.body;
    Student.updateStudent(username, updateingStudent, function(err, student) {

        if(err) {

            if(err.message === Messages.eng.update.usernameNotFound) {
                res.statusCode = 404;
                return respondTo(err, res);
            }
            return respondTo(err, res, null, 400);
        }
        return respondTo(null, res, student);
    });
};


/**
 * Private helper for formating the answers
 * @param req
 * @param res
 * @param code
 * @returns {Request}
 */
function respondTo(error, res, data, code) {
    if(code) {
        res.statusCode = code;
    }
    res.setHeader("Content-Type", "application/json");
    if(error) {
        return res.send({'errorMessage' : error.message});
    }
    return res.send(JSON.stringify(data));
}

