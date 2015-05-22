/**
 * Created by thajo on 22/05/15.
 */
'use strict';
var request = require('request');

function getUserInformation(username, callback) {
    var url = "https://api.github.com/users/" +username;
    console.log("calling %s", url);

    var options = {
        url: url,
        headers: {
            'User-Agent': 'Clampdown v.0.1 - john.haggerud@lnu.se'
        }
    };
    request(options, function(err, response, body) {
       if(err) {
           console.log("error %s",err );
           return callback(err);
       }
       if(response.statusCode === 200) {

           return callback(null, body);
       }
       return callback(new Error('Something with the call to Github went wrong'));
    });

}

exports.getUserInfo = getUserInformation;
