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
    var currentStudent = new Student(studentObject);

    currentStudent.save(function(err) {
        if (err) {
           return callback(err);
        }

        // we choose this approch for safty and correct format
        getStudent(currentStudent.username, callback);
    });
}

/**
 * List all current users in the system
 * @param {function} callback - node standard callback function, returns the student object @see StudentSchema
 */
function listStudents(callback, filterOptions) {
    filterOptions = filterOptions || {};
    Student.find(filterOptions, whiteList).lean().exec(function(err, doc) {
        if (err) {
            return callback(err);
        }

        callback(null, doc);
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

       // var result =  asJSON(doc); // Hmmm...?
        return callback(null, doc); // stingify the result
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
 * Delete a specific user by username
 * @public
 * @param {String} username - The username of the student to update
 * @param {Object} newObject - The updated object
 * @param {function} callback - The node standard callback function
 */
function updateStudent(username, newObject, callback) {

    // ToDO: Stupid!

    // Have to do this since i chose to normilize the stuff when saved
    // Cant find a good way to do this in pre findAndUpdate hook
    if (newObject.city) {
        var c = newObject.city.toLowerCase();
        newObject.city = c.charAt(0).toUpperCase() + c.slice(1);

    }

    Student.findOneAndUpdate({username: username}, {$set: newObject}, {
        select: whiteList,
        new: true,
        runValidators: true,
        context: "query"
    }).lean().exec(function (err, result) {
        if (err) {

            return callback(err);
        }

        if (!result) {
            // ToDo: String dependency
            return callback(new Error("Not found"));
        }

        callback(null, result);
    });
}
