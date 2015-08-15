/*jshint expr: true */
'use strict';

/**
 * This is the integration test suit responsible for
 *      - Routing
 *      - Status codes
 *      - HTTP Headers
 *      - Geting data for REST service
 */

require('../../utils');


var server = require('../../../app.js');
var should = require('chai').should();
var expect = require('chai').expect;
var superagent = require('superagent');
var URL = 'http://localhost:3000/api';

var keys = require('../../../config/secrets.js');

describe("#### Integrationtest - GitHub ###", function() {

    var app;

    before(function() {
        //app = server;
    });

    after(function() {
        //server.close();
    });

    it("Should return a user object from github", function(done) {
        superagent
            .get(URL +'/github/thajo')
            .set('Accept', 'application/json')
            .set('Authorization', keys.APIReadKey)
            .end(function(err, response) {

                should.not.exist(err);
                should.equal(response.status, 200);
                done();
        });

    });

    it("Should return a 404 when a non user is called", function(done) {
        superagent
            .get(URL +'/github/thajoasjdkljasldjaklsd')
            .set('Accept', 'application/json')
            .set('Authorization', keys.APIReadKey)
            .end(function(err, response) {

                should.equal(response.status, 404);
                done();
            });

    });


});