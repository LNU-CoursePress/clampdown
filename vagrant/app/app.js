'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//Here we are configuring express to use body-parser as middle-ware.
// This will parse the body as urlencoded just allowing string and arrays => Extended = false
app.use(bodyParser.urlencoded({ extended: false }));

// Configure the handlebar
var exphbs = require('express-handlebars');
app.engine('.html', exphbs({defaultLayout: 'home', extname: '.html'}));
app.set('view engine', '.html');

//var mongoose = require('mongoose');

app.get('/', function(req, res) {
    res.render('index', {title: 'Start page!'});
});

// Should do redirect
app.post('/', function(req, res) {
    var schoolName = req.body.schoolUsername;
    var githubName = req.body.githubUsername;

    if(schoolName.length < 1 || githubName < 1) {
        return res.render('index', {error: 'Didn\'t provide correctly'});
    }
    res.redirect('/thanx');
    console.log('I\'ve got %s and %s', schoolName, githubName);
});

app.get('/thanx', function(req, res){
    res.render('thanx');
});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);

});
/**
 * mongoose.connect('mongodb://localhost/test');
mongoose.connection.on('connected', function (error) {
 if(error) {
 return console.log(error);
 }
 console.log("Connection to mongoDB worked!");
 })*/
