var gulp = require('gulp');
var debug = require('gulp-debug');

var webserver = require('gulp-webserver');
var zip = require('gulp-zip');
var del = require('del');
var extend = require('gulp-extend');

/* sync app config with changes in config.json and version.json */
gulp.task('config', function () {
    return gulp.src(['config.json', 'version.json'])
        .pipe(extend('config.json'))
        .pipe(gulp.dest('app'));
});

gulp.task('clean', function () {
    return del([
        '.dist'
    ]);
});

gulp.task('zip', function () {
    return gulp.src([".build/**/*"])
        .pipe(zip('ui.zip'))
        .pipe(gulp.dest('.dist'));
});

gulp.task('webserver', function () {

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    gulp.src('.build')
        .pipe(webserver({
            port: 7000,
            https: true,
            proxies: [
                {
                    source: '/proxy/api', target: 'https://localhost:10281/proxy/api'
                },
                {
                    source: '/proxy/raw', target: 'https://localhost:10281/proxy/raw'
                }
            ]
        }));
});

var Server = require('karma').Server;

gulp.task('test', function (done) {
    new Server({
        configFile: require('path').resolve('karma.conf.js'),
        singleRun: true
    }, done).start();
});

