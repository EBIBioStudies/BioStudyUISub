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
var rimraf = require('gulp-rimraf');
var gutil = require('gulp-util');

var gulp = require('gulp');
var bower = require('gulp-bower');

var envHelper=require('./tasks/helpers/envHelper');
var webserver = require('gulp-webserver');
var war = require('gulp-war');
var bump = require('gulp-bump');
var ngConstant = require('gulp-ng-constant');


gulp.task('bump', function () {
    return gulp
        .src('./config.json')
        .pipe(bump({
            //type: 'minor',
            //type: 'major',
            key: 'APP_VERSION'
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('config', function () {
    return gulp.src('./config.json')
        .pipe(ngConstant({
            wrap: 'commonjs',
            name: 'BioStudyApp.config'
        }))
        .pipe(gulp.dest('./public/js'));
});

gulp.task('bower', function () {
    return bower();
});

gulp.task('clean', function () {
  return gulp.src([envHelper.copyToPath + '/css/**/*', envHelper.copyToPath + '/images/**/*',
    envHelper.copyToPath + '/js',envHelper.copyToPath + '/partials/**/*', '.gen/**/*', '.war/**/*'], {read: false})
      .pipe(rimraf({ force: true }));
});

gulp.task('copy', ['clean'], function(cb) {
  //copy components if dir different
  if (envHelper.copyToPath!='.build') {
    gulp.src('.build/components/**/*')
        .pipe(gulp.dest(envHelper.copyToPath + '/components'))
  }

  gulp.src('public/js/external/msAngularUi.css')
      .pipe(gulp.dest(envHelper.copyToPath + '/css/'));
  gulp.src(['public/images/**/*.png', 'public/images/*.ico'])
      .pipe(gulp.dest(envHelper.copyToPath + '/images'));
  gulp.src(['public/partials/**/*'])
      .pipe(gulp.dest(envHelper.copyToPath + '/partials'));
  gulp.src('public/js/polyfill.js')
      .pipe(gulp.dest(envHelper.copyToPath + '/js/'));
  gulp.src('views/*.html')
      .pipe(gulp.dest(envHelper.copyToPath));

  cb();

});


gulp.task('jshint', function () {
  return gulp.src('public/js/services/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('html2js',['clean','copy','jshint'],function () {

  return gulp.src(["public/templates/**/*.html","public/js/**/*html"])
    .pipe(templateCache({
      standalone: true,
      module: 'bs-templates',
      root: 'templates'
    }))
    .pipe(gulp.dest(".gen"));
});

gulp.task('js', ['clean','copy', 'bower', 'jshint','html2js'], function () {
  var b = browserify({
    entries: 'public/js/app.js',
    debug: true
  });
  var app = b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer());
  /*var views = gulp.src('public/templates/.html')
    .pipe(templateCache({
      standalone: true,
      module: 'bs-templates',
      root: 'templates'
    }));*/
  return sq({ objectMode: true }, app)
    .pipe(concat('main.js'))
    .pipe(ngAnnotate())
    //.pipe(uglify()) TODO: Fix the problem with uglify
    .pipe(gulp.dest(envHelper.copyToPath + '/js'));

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

var jasmine = require('gulp-jasmine');
var reporters = require('jasmine-reporters');

gulp.task('unit:js', function() {
  gulp.src(["shared/model/*.Spec.js","public/js/model/*.Spec.js"])
    .pipe(jasmine({verbose: true,includeStackTrace: true

    }));
});

var karma = require('karma').server;
var ROOT = require('./tasks/gulp/const').ROOT;
gulp.task('unit:public', function() {
  var karmaConfig = {
    logLevel: 'warn',
    singleRun: true,
    autoWatch: false,
    configFile: ROOT + '/tests/karma.conf.js'
  };

  function captureError(next,done) {
    gutil.log('Running unit tests on unminified source.');
  }

  gutil.log('Running unit tests on unminified source.');
  karma.start(karmaConfig, captureError());
});

gulp.task('war', function () {
  gulp.src([".build/**/*.*"])
      .pipe(war({
        welcome: 'index.html'
      }))
      .pipe(gulp.dest(".war"));
});

gulp.task('webserver', ['clean', 'js', 'ejs', 'styles'], function() {
  gulp.src('.build')
      .pipe(webserver({
        port: 7000,
        proxies   : [
          {
            source: '/proxy/api', target: 'http://localhost:10280/proxy/api'
          },
          {
            source: '/proxy/raw', target: 'http://localhost:10280/proxy/raw'
          }
        ]
      }));
});


gutil.log('Build client for environment ',process.env.NODE_ENV);
gutil.log('Deploy client to ',envHelper.copyToPath);

gulp.task('default', ['clean', 'bower', 'copy', 'html2js', 'jshint', 'styles', 'js', 'ejs']);



