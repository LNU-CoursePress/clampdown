"use strict";

// the public API
exports.createStudent = createStudent;
exports.listStudents = listStudents;
exports.showStudent = getStudent;
exports.deleteStudent = deleteStudent;
exports.updateStudent = updateStudent;

// private variables
var whiteList = "-_id -__v"; // use to remove stuff we dont want in the response
var Student = require("./student.schema.js").Student;
var Messages = require("./student.Strings.js").Messages;
var debug = require("debug")("filtering");


/**
 * Creates a student and saves it in the db.
 * @public
 * @param {Object} studentObject - An object repressention the student schema model
 * @param {function} callback - node standard callback function
 */
function createStudent(studentObject, callback) {

    var username = studentObject.username;

    Student.find({username: username}, function(err, result) {
        var currentStudent = new Student(studentObject);
        if (err) {
            return callback(err);
        }

        if (result.length) {
            return callback(new Error(Messages.eng.create.usernameTaken));
        }
        else {
            currentStudent.save(function(err) {
                if (err) {
                    //console.log('Error in creating student:', err);
                    return callback(err);
                }

                // we choose this approch for safty and correct format
                getStudent(currentStudent.username, callback);
            });
        }
    });
}

/**
 * List all current users in the system
 * @param {function} callback - node standard callback function, returns the student object @see StudentSchema
 */
function listStudents(callback, filterOptions) {
    filterOptions = filterOptions || {};
    debug("Result filtering in model: ", filterOptions);
    Student.find(filterOptions, whiteList).lean().exec(function(err, doc) {
        if (err) {
            return callback(err);
        }

        debug("Result", doc);
        callback(null, asJSON(doc));
    });
}

/**
 * Show a specific user
 * @public
 * @param {String} username - The username of the student to show
 * @param {function} callback - The node standard callback function
 */
function getStudent(username, callback) {
    // lean is JSON not MongooseDocuments
    Student.findOne({username: username}, whiteList).lean().exec(function(err, doc) {

        if (err) {
            return callback(err);
        }

        if (!doc) {
            return callback(new Error(Messages.eng.show.usernameNotFound));
        }

        var result =  asJSON(doc); // Hmmm...?
        return callback(null, result); // stingify the result
    });
}

/**
 * Delete a specific user by username
 * @public
 * @param {String} username - The username of the student to show
 * @param {function} callback - The node standard callback function
 */
function deleteStudent(username, callback) {
    Student.findOneAndRemove({ username:username }, function(err) {
        if (err) {
            return callback(err);
        }

        // This is indempotent so if we call a non existing to remove is all good
        callback(null, Messages.eng.delete.success);
    });
}

/**
 * TODO: Refactor
 * Delete a specific user by username
 * @public
 * @param {String} username - The username of the student to update
 * @param {Object} newObject - The updated object
 * @param {function} callback - The node standard callback function
 */
function updateStudent(username, newObject, callback) {

    // Mongoose is stupid - First check if user exist so we can make own partial update and
    // also have som kind of validation
    getStudent(username, function(err, student) {
        // couldn't find the student?
        if (err) {
            return callback(err);
        }

        // if the provided object is empty just send the db-object back
        if (Object.getOwnPropertyNames(newObject).length === 0) {
            return callback(null, student);
        }

        // User should never change username so overwrite it with db-saved
        newObject.username = student.username;

        // go through the provided Object and update all properties
        // overwrite the props - TODO: This makes the result order to look diffrent - Look into it
        for (var prop in newObject) {
            if (newObject.hasOwnProperty(prop)) {
                student[prop] = newObject[prop];
            }
        }

        // we do validate the new object (do this for enums and stuff)
        var tmp = new Student(student);
        tmp.validate(function(err) {
            if (err && err.errors) {
                return callback(err);
            }

            // check up the username, replace with newObject, just return the selected whitelist, return the newly(new:true) updated object
            Student.findOneAndUpdate({username: student.username}, { $set: student}, {select: whiteList, new: true}).lean().exec(function(err, result) {
                if (err) {
                    return callback(err);
                }

                callback(null, result);
            });
        });
    });
}

/**
 * @private
 * Take a BSON-object (mongoose document) and make it to JSON
 * @param {Object} doc
 * @return {Object} - An JSON-object
 */
function asJSON(doc) {
    return JSON.parse(JSON.stringify(doc));
}