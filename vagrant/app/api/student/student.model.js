'use strict';

exports.saveStudent = saveStudent;
exports.listStudents = listStudents;
exports.showStudent = showStudent;
exports.deleteStudent = deleteStudent;
exports.updateGithubUsername = updateGithubUsername;

var whiteList = '-_id username githubName';

var Student = require('./student.schema.js').Student;
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

    Student.find({}, whiteList).lean().exec(function (err, doc) {

        if (err) {
            return callback(err);
        }
       callback(null, asJSON(doc));
    });
}

function showStudent(username, callback) {
    // lean is JSON not MongooseDocuments
    Student.findOne({username: username}, whiteList).lean().exec(function(err, doc) {
        if(err) {
            return callback(err);
        }
        var result =  asJSON(doc); // Hmmm...?
        callback(null, result); // stingify the result
    });
}

function asJSON(doc) {
    return JSON.parse(JSON.stringify(doc));
}