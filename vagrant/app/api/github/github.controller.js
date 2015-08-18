/**
 * This is just a stupid github user account checker
 */

'use strict';

exports.check = function(req, res) {
    var username = req.params.username;

    // check if username exist on github
    getUserInformation(username, function(err, result) {
        if(err) {
           console.log(err);
           return res.sendStatus(404);
        }
        res.send(result);
    });

};

var request = require('request');

function getUserInformation(username, callback) {
    var url = "https://api.github.com/users/" +username;
    console.log("calling %s", url);

    var options = {
        url: url,
        headers: {
            'User-Agent':   'Clampdown v.0.1',
            'Accept':       'application/json'
        }
    };
    request(options, function(err, response, body) {
       // console.log("call ready", url);
        if(err) {
            console.log("error from Github %s",err );
            return callback(err);
        }
        if(response.statusCode === 200) {
            return callback(null, body);
        }
        if(response.statusCode === 404) {
            return callback(new Error('No github-user with that name'));
        }
    });

}