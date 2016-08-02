var jshint = require('gulp-jshint');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');

var buffer = require('vinyl-buffer');
var sq = require('streamqueue');
var less = require('gulp-less');
//var sourcemaps = require('gulp-sourcemaps');
var minifyCSS = require('gulp-cssnano');
var templateCache = require('gulp-angular-templatecache');
var concat = require('gulp-concat');
var ngHtml2Js = require("gulp-ng-html2js");
var rename = require('gulp-rename');

var gutil = require('gulp-util');

var gulp = require('gulp');

var envHelper = require('./tasks/helpers/envHelper');
var webserver = require('gulp-webserver');
var zip = require('gulp-zip');
var bump = require('gulp-bump');
var ngConfig = require('gulp-ng-config');
var del = require('del');
var extend = require('gulp-extend');
var Builder = require('systemjs-builder');
var ngAnnotate = require('gulp-ng-annotate');

/* increment the version */
gulp.task('bump', function () {
    return gulp
        .src('version.json')
        .pipe(bump({
            //type: 'minor',
            //type: 'major',
            key: 'APP_VERSION'
        }))
        .pipe(gulp.dest('./'));
});

/* sync app config with changes in config.json and version.json */
gulp.task('config', function () {
    return gulp.src(['config.json', 'version.json'])
        .pipe(extend('config.json'))
        .pipe(ngConfig('BioStudyApp.config',
            {
                wrap: 'ES6'
            }
        ))
        .pipe(gulp.dest('app/lib'));
});

gulp.task('clean:js', function () {
    return del([
        '.dist/lib'
    ]);
});

gulp.task('clean:images', function () {
    return del([
        '.dist/images'
    ]);
});

gulp.task('clean:jspm_packages', function () {
    return del([
        '.dist/jspm_packages'
    ]);
});

gulp.task('clean', ['clean:js', 'clean:images', 'clean:jspm_packages']);

gulp.task('copy:images', ['clean:images'], function () {
    return gulp.src(['app/images/**/*'])
        .pipe(gulp.dest('.dist/images'));
});

gulp.task('copy:jspm_packages', ['clean:jspm_packages'], function () {
    return gulp.src(['jspm_packages/**/*'])
        .pipe(gulp.dest('.dist/jspm_packages'));
});

/* a workaround for: SystemJS builder doesn't create sub-folders automatically for css files */
gulp.task('mkdir', ['clean:js'], function() {
    return gulp.src(['app/lib', '!app/lib/**/*'], {base: 'app'})
        .pipe(gulp.dest('.dist'));
});

gulp.task('js', ['mkdir'], function (cb) {
    var builder = new Builder('app', 'app/jspm.config.js');
    builder.config({
        separateCSS: true
    });
    builder.bundle('lib/main.js', '.dist/lib/main.js', {
        minify: false,
        mangle: false
    })
        .then(function () {
            gulp.src('.dist/lib/main.js')
                .pipe(ngAnnotate())
                .pipe(uglify({sourceMaps: true}))
                .pipe(gulp.dest('.dist/lib'));
            cb();
        })
        .catch(function (err) {
            console.log('Build error');
            console.log(err);
            cb(err);
        });
});

gulp.task('zip', function () {
    gulp.src([".dist/**/*.*"])
        .pipe(zip('ui.zip'))
        .pipe(gulp.dest('.dist'));
});

gulp.task('default', ['js', 'css', 'images']);

gulp.task('webserver', [], function () {

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    gulp.src('./app')
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


var karma = require('gulp-karma');

gulp.task('test', function () {
    // Be sure to return the stream
    // NOTE: Using the fake './foobar' so as to run the files
    // listed in karma.conf.js INSTEAD of what was passed to
    // gulp.src !
    return gulp.src('./foobar')
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }))
        .on('error', function (err) {
            // Make sure failed tests cause gulp to exit non-zero
            console.log(err);
            this.emit('end'); //instead of erroring the stream, end it
        });
});

gulp.task('autotest', function () {
    return gulp.watch(['public/js/**/*.js', 'test/spec/*.js'], ['test']);
});


