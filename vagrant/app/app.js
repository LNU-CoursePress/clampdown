'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');             // log requests to the console (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

//Here we are configuring express to use body-parser as middle-ware.

app.use(bodyParser.urlencoded({ extended: false }));            // This will parse the body as urlencoded just allowing string and arrays => Extended = false
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));




// Configure the handlebar
var exphbs = require('express-handlebars');
app.engine('.html', exphbs({defaultLayout: 'home', extname: '.html'}));
app.set('view engine', '.html');

var db = require('./dbFactory');
db.createDbConnection('localhost', 'students'); // doent mind the async here - only serverstart
var studentDB = require('./student');

app.get('/', function(req, res) {
    res.render('index', {title: 'Start page!'});
});

// Should do redirect
app.post('/', function(req, res) {
    var gh = require('./github');
    var schoolName = req.body.schoolUsername;
    var githubName = req.body.githubUsername;
    if(schoolName.length < 1 || githubName < 1) {
        return res.render('index', {error: 'Didn\'t provide correctly'});
    }

    // Check if user alredy exists
    studentDB.showStudent(githubName, function(err, result) {
        console.log("Result: %s", result);
        console.log(result.length);
        if(err) {
           return console.log("Problem with connection when tryng to find user?");
        }
        if(result.length > 0) {
           return res.render('index', {error: 'User is alredy registerd'});
        }
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


});

app.post('/students/', function(req, res) {
    // TODO: DRY!
    var schoolName = req.body.username;
    var githubName = req.body.githubName;
    if(schoolName.length < 1 || githubName < 1) {
        return res.render('index', {error: 'Didn\'t provide correctly'});
    }
    studentDB.saveStudent(schoolName, githubName, function(err, result) {
        if(err) {
            console.log('Error: %s, Student: %s', err, result);
        }
        res.redirect('/thanx');
    });
});

app.get('/thanx', function(req, res){
    res.render('thanx');
});




app.get('/students', function(req, res) {
    studentDB.listStudents(function(students) {
        console.log(students);
        res.render('students', {students: students});
    });
});



app.delete('/students/:username', function(req, res){
    console.log("Should remove: %s", req.param('username'));
    var username = req.param('username');
    studentDB.deleteStudent(username, function(err) {
        if(err) {
            console.log(err);
        }
        res.redirect('/students');
    });
});

app.patch('/students/:username', function(req, res){
    console.log("Should update: %s with: %s", req.param('username'), req.param('githubName'));
    var username = req.param('username');
    var githubName = req.param('githubName');
    studentDB.updateGithubUsername(username, githubName, function(err) {
        if(err) {
            console.log(err);
        }
        res.redirect('/students');
    });
});




var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);

});

