/**
 * Main application routes
 */

'use strict';

module.exports = function(app) {

    app.use('/', require('./api/student'));
    app.use('/', require('./website/student'));

    // To the API
   // app.use('/api', require('./api/student'));
   // app.use('/api/students', require('./api/student'));
   // app.use('/api/thanx', require('./api/student'));

    // to the api
   // app.use('api/students/', require('./api/student'));
   // app.use('/auth', require('./auth'));

};
