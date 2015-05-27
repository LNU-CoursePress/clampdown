/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /                    ->  index - the start form
 * POST    /                    ->  lookup at github, present a confirm dialog
 * GET     /thanx               ->  Landing page for correct submission
  */

'use strict';

//var _ = require('lodash');
var Student = require('./student.model');

// Get list of things
exports.index = function(req, res) {
    res.render('index', {title: 'Start page!'});
};

exports.begin = function(req, res) {
    var schoolName = req.body.schoolUsername;
    var githubName = req.body.githubUsername;

    if(schoolName.length < 1 || githubName < 1) {
        return res.render('index', {error: 'Didn\'t provide correctly'});
    }

    // Check if user alredy exists
    Student.showStudent(githubName, function(err, result) {
        if(err) {
            return console.log("Problem with connection when tryng to find user?");
        }
        if(result.length > 0) {
            return res.render('index', {error: 'User is alredy registerd'});
        }
        var gh = rootRequire('helpers/github'); //jshint ignore:line
        gh.getUserInfo(githubName, function(err, result) {

            if(!result) {
                return res.render('index', {error: 'Can\'t find any github user with that name'});
            }
            try {
                result = JSON.parse(result);
            }
            catch(e) {
                console.log('Error, %s', e);
                return res.render('index', {error: 'Github responded with bad data!'});
            }

            var name = result.name;
            var url = result.avatar_url;
            var email = result.email;
            res.render('confirm', {username: schoolName, githubName: githubName, name: name, url: url, email: email});
        });

    });
};


exports.thanx = function(req, res){
    res.render('thanx');
};

