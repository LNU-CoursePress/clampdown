'use strict';
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/student');

var Student = mongoose.model('Student',
    {
        username: String,
        githubName: String
    });

function saveStudent(username, githubName, callback) {
    var student = new Student({
        username: username,
        githubName: githubName
    });

    Student.find({username : username}, function (err, result) {
        if(err) {
            return callback("Error in saving student");
        }

        if (result.length){
            return callback('Name exists already', null);
        }
        else {
            student.save(function(err){
                if(err) {
                    return callback(err);
                }
                return callback(null, student);
            });
        }
    });
}

function deleteStudent(username, callback) {
    Student.findOneAndRemove({ username:username }, callback );
}

function updateGithubUsername(username, githubName, callback) {
    Student.findOneAndUpdate({username: username}, {githubName: githubName}, callback);
}

function listStudents(callback) {
    Student.find(function (err, students) {
        if (err) {
            return callback(err);
        }
        callback(students);
    });
}

exports.saveStudent = saveStudent;
exports.listStudents = listStudents;
exports.deleteStudent = deleteStudent;
exports.updateGithubUsername = updateGithubUsername;