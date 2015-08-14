'use strict';
// Bring Mongoose into the app
var mongoose = require( 'mongoose' );
var config = require('./config/environment');


// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection is connected');
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// When the connection is open
mongoose.connection.on('open', function () {
    console.log('Mongoose default connection is open');


});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});


function createDbConnection(dbNameURL, options) {

    console.log(dbNameURL);
    // Create the database connection
    mongoose.connect(dbNameURL, options);
}

exports.createDbConnection = createDbConnection;