'use strict';

// the public API
exports.createStudent = createStudent;
exports.listStudents = listStudents;
exports.showStudent = showStudent;
exports.deleteStudent = deleteStudent;
exports.updateStudent = updateStudent;



// private variables
var whiteList = '-_id -__v'; // use to remove stuff we dont want in the response
var Student = require('./student.schema.js').Student;
var Messages = require('./student.Strings.js').Messages;


/**
 * Creates a student and saves it in the db.
 * @public
 * @param {Object} studentObject - An object repressention the student schema model
 * @param {function} callback - node standard callback function
 */
function createStudent(studentObject, callback) {
    var username = studentObject.username;

    // TODO: Use mongoose unique insteed
    Student.find({username : username}, function (err, result) {
        var currentStudent = new Student(studentObject);
        if(err) {
            return callback(err);
        }
        if (result.length){
            return callback(new Error(Messages.eng.create.usernameTaken));
        }
        else {
            currentStudent.save(function(err){
                if(err) {
                    return callback(err);
                }
                return callback(null, currentStudent);
            });
        }
    });
}

/**
 * List all current users in the system
 * @param {function} callback - node standard callback function, returns the student object @see StudentSchema
 */
function listStudents(callback) {
    Student.find({}, whiteList).lean().exec(function (err, doc) {
        if (err) {
            return callback(err);
        }
       callback(null, asJSON(doc));
    });
}

/**
 * Show a specific user
 * @public
 * @param {String} username - The username of the student to show
 * @param {function} callback - The node standard callback function
 */
function showStudent(username, callback) {
    // lean is JSON not MongooseDocuments
    Student.findOne({username: username}, whiteList).lean().exec(function(err, doc) {
        if(err) {
            return callback(err);
        }
        if(!doc) {
            return callback(new Error(Messages.eng.show.usernameNotFound));
        }
        var result =  asJSON(doc); // Hmmm...?
        callback(null, result); // stingify the result
    });
}

/**
 * Delete a specific user by username
 * @public
 * @param {String} username - The username of the student to show
 * @param {function} callback - The node standard callback function
 */
function deleteStudent(username, callback) {
    Student.findOneAndRemove({ username:username }, function(err, result) {
        if(err) {
            return callback(err);
        }
        if(!result) {
            callback(new Error(Messages.eng.delete.usernameNotFound));
        }
        callback(null, Messages.eng.delete.success);
    });
}

/**
 * Delete a specific user by username
 * @public
 * @param {String} orginalUsername - The username of the student to update
 * @param {Object} newObject - The updated object
 * @param {function} callback - The node standard callback function
 */
function updateStudent(orginalUsername, newObject, callback) {
    // check up the username, replace with newObject, just return the selected whitelist, return the newly updated object
    Student.findOneAndUpdate({username: orginalUsername}, newObject, {select: whiteList, new: true}).lean().exec(function(err, result) {
        if(err) {
            return callback(err);
        }
        if(!result) {
            return callback(new Error(Messages.eng.update.usernameNotFound));
        }
        callback(null, result);
    });
}

/**
 * @private
 * Take a BSON-object (mongoose document) and make it to JSON
 * @param {Object} doc
 */
function asJSON(doc) {
    return JSON.parse(JSON.stringify(doc));
}