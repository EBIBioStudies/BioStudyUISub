var jshint = require('gulp-jshint');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var ngAnnotate = require('gulp-ng-annotate');
var buffer = require('vinyl-buffer');
var sq = require('streamqueue');
var less=require('gulp-less');
//var sourcemaps = require('gulp-sourcemaps');
var minifyCSS = require('gulp-cssnano');
var templateCache = require('gulp-angular-templatecache');
var concat = require('gulp-concat');
var ngHtml2Js = require("gulp-ng-html2js");
var rename = require('gulp-rename');
var ejs = require("gulp-ejs");

var gutil = require('gulp-util');

var gulp = require('gulp');
var bower = require('gulp-bower');

var envHelper=require('./tasks/helpers/envHelper');
var webserver = require('gulp-webserver');
var zip = require('gulp-zip');
var bump = require('gulp-bump');
var ngConfig = require('gulp-ng-config');
var clean = require('gulp-clean');
var extend = require('gulp-extend');
var Builder = require('systemjs-builder');

var distDir = ".dist";

/* increment the version */
gulp.task('bump', function () {
    return gulp
        .src('./version.json')
        .pipe(bump({
            //type: 'minor',
            //type: 'major',
            key: 'APP_VERSION'
        }))
        .pipe(gulp.dest('./'));
});

/* sync app config with changes in config.json and version.json */
gulp.task('config', function () {
    return gulp.src(['./config.json', './version.json'])
        .pipe(extend('config.json'))
        .pipe(ngConfig( 'BioStudyApp.config',
            {
            wrap: 'ES6'
            }
        ))
        .pipe(gulp.dest('./app/lib'));
});

gulp.task('clean', function () {
    return gulp.src(['./dist'])
        .pipe(clean({force: true}));
});

gulp.task('copy', ['clean'], function(cb) {
  gulp.src(['./app/images/**/*'])
      .pipe(gulp.dest('./dist/images'));
  cb();
});

gulp.task('js', ['clean'], function () {
    var builder = new Builder('./app', './app/jspm.config.js');
    builder.buildStatic('lib/main.js', '.dist/main.min.js', {
        separateCSS: true,
        minify: true,
        sourceMaps: false
    });
});


gulp.task('styles', ['clean'],function() {
  return gulp.src('public/less/app.less')
    .pipe(less())
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(gulp.dest(envHelper.copyToPath + '/css'));
});


gulp.task('ejs', ['clean'], function() {
  return gulp.src("views/index.ejs")
    .pipe(ejs({
    }))
    .pipe(gulp.dest(envHelper.copyToPath ));
});

gulp.task('zip', function () {
    gulp.src([".build/**/*.*"])
        .pipe(zip('ui.zip'))
        .pipe(gulp.dest('./.dist'));
});

//gulp.task('webserver', ['clean', 'js', 'ejs', 'styles'], function () {
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



gulp.task('default', ['clean', 'bower', 'copy', 'html2js', 'jshint', 'styles', 'js', 'ejs']);


var karma = require('gulp-karma');

gulp.task('test', function() {
    // Be sure to return the stream
    // NOTE: Using the fake './foobar' so as to run the files
    // listed in karma.conf.js INSTEAD of what was passed to
    // gulp.src !
    return gulp.src('./foobar')
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }))
        .on('error', function(err) {
            // Make sure failed tests cause gulp to exit non-zero
            console.log(err);
            this.emit('end'); //instead of erroring the stream, end it
        });
});

gulp.task('autotest', function() {
    return gulp.watch(['public/js/**/*.js', 'test/spec/*.js'], ['test']);
});


