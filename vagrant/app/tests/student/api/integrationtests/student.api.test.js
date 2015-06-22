/*jshint expr: true */
'use strict';



// import the moongoose helper utilities
require('../../../utils');


var server = require('../../../../app.js');
var should = require('chai').should();
var expect = require('chai').expect;
var superagent = require('superagent');


describe('# Students API', function() {


    var app;

    before(function() {
        app = server;
    });

    after(function() {
        server.close();
    });

    describe('### /students', function() {
        it('should list all the students', function(done) {
            superagent.get('http://localhost:3000/students')
                .set('Accept', 'application/json')
                .end(function(err, res) {
                should.not.exist(err);
                should.equal(res.status, 200);
                var result = JSON.parse(res.text);

                    result = result.students;
                    should.equal(result.length, 2);



                done();
            });
        });
    });
});