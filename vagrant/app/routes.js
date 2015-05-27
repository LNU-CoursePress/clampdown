/**
 * Main application routes
 */

'use strict';

module.exports = function(app) {

    // To the registration web site
    app.use('/', require('./api/student'));
    app.use('/students', require('./api/student'));
    app.use('/thanx', require('./api/student'));

    // to the api
   // app.use('api/student/', require('./api/student'));
   // app.use('/auth', require('./auth'));

};
