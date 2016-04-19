/**
 * This is just a stupid github user account checker
 */
'use strict';

var request = require('request');

exports.check = function(req, res) {
    var username = req.params.username;

    // check if username exist on github
    getUserInformation(username, function(err, result) {
        if (err) {
            console.log(err);
            return res.sendStatus(404);
        }

        res.send(result);
    });

};

function getUserInformation(username, callback) {
   /* var key = process.env.GITHUB_API_KEY || "";
    var url;

    if (key.length > 2) {
        url = "https://thajo:" + key + "@api.github.com/users/" +username;
    } else {
        url = "https://api.github.com/users/" + username;
    }*/

    var url = "https://api.github.com/users/" + username;

    var options = {
        url: url,
        headers: {
            "User-Agent":   "Clampdown v.0.1",
            "Accept":       "application/json"
        }
    };
    request(options, function(err, response, body) {
        if (err) {
            console.log("error from Github %s", err);
            return callback(err);
        }

        if (response.statusCode === 200) {
            return callback(null, body);
        }

        if (response.statusCode === 404) {
            return callback(new Error('No github-user with that name'));
        }
    });

}