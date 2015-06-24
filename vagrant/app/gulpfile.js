'use strict';

var gulp       = require( 'gulp' ),
    server     = require( 'gulp-develop-server' ),
    livereload = require( 'gulp-livereload'),
    mocha      = require( 'gulp-mocha'),
    jshint = require('gulp-jshint');

var options = {
    path: './app.js'
};



var serverFiles = [
    './**/*.js'
];

gulp.task( 'server:start', function() {
    server.listen( options, livereload.listen );

});

// If server scripts change, restart the server and then livereload.
gulp.task( 'default', [ 'server:start' ], function() {

    function restart( file ) {
        server.changed( function( error ) {
            if( ! error ) livereload.changed( file.path );
        });
    }

    gulp.watch( serverFiles ).on( 'change', restart );
});

gulp.task('debug', function() {
    var debugOptions = {
      path: './app.js',
      execArgv: ['--debug-brk']
    };
    server.listen( debugOptions);

    function restart( file ) {
        server.changed( function( error ) {
            if( ! error ) livereload.changed( file.path );
        });
    }

    gulp.watch( serverFiles ).on( 'change', restart );
});

gulp.task('hint', function() {
    gulp.src('./api/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'), { verbose: true });
});

gulp.task('mocha', function() {
    gulp
        .src('./tests/**/*.js')
        .pipe(mocha({ reporter: 'list' }))
        .on('error', function(err){ console.log(err.toString()); this.emit('end');  });// should maby log this?

});

gulp.task('test', ['mocha', 'hint']);
