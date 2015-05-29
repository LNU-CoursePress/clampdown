'use strict';

/*
 * Modified from https://github.com/elliotf/mocha-mongoose
 */



// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
process.env.NODE_ENV = 'test';
var config = require('../config/environment');
var mongoose = require('mongoose');


beforeEach(function (done) {


    function clearDB() {
        /*for (var i in mongoose.connection.collections) {
            mongoose.connection.collections[i].remove(function() {});
        }*/
        if(config.seedDB) {

            require('./seed.js').seed(function() {
               // console.log("seed done");
               return done();
            });
        }
        else {
            return done();
        }
        //
    }

    if (mongoose.connection.readyState === 0) {
        mongoose.connect(config.mongo.uri, function (err) {
            if (err) {
                throw err;
            }
            return clearDB();
        });
    } else {
        return clearDB();
    }
});

afterEach(function (done) {
    mongoose.disconnect();
    return done();
});