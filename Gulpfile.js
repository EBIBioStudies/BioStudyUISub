var gulp = require('gulp');

var webserver = require('gulp-webserver');
var zip = require('gulp-zip');
var bump = require('gulp-bump');
var ngConfig = require('gulp-ng-config');
var del = require('del');
var extend = require('gulp-extend');
var Builder = require('jspm').Builder; //require('systemjs-builder');
var htmlreplace = require('gulp-html-replace');

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
        '.build/lib'
    ]);
});

gulp.task('clean:images', function () {
    return del([
        '.build/images'
    ]);
});

gulp.task('clean:jspm_packages', function () {
    return del([
        '.build/jspm_packages'
    ]);
});

gulp.task('clean', ['clean:js', 'clean:images', 'clean:jspm_packages']);

gulp.task('copy:images', ['clean:images'], function () {
    return gulp.src(['app/images/**/*'], {base: 'app'})
        .pipe(gulp.dest('.build/'));
});

gulp.task('copy:jspm_packages', ['clean:jspm_packages'], function () {
    return gulp.src(['app/jspm_packages/**/*'], {base: 'app'})
        .pipe(gulp.dest('.build/'));
});

gulp.task('copy:jspm_config', function () {
    return gulp.src(['app/jspm.config.js'])
        .pipe(gulp.dest('.build/'));
});

gulp.task('copy', ['copy:images', 'copy:index', 'copy:jspm_packages', 'copy:jspm_config']);

gulp.task('copy:index', function() {
    return gulp.src(['app/index.html', 'app/thor-integration.html'])
        .pipe(htmlreplace({
            'css': ['lib/main.css', 'lib/main-from-less.css'],
            'js': {
                src: ['jspm.prod.js'],
                tpl: '<script src="%s"></script>'
            }
        }))
        .pipe(gulp.dest('.build/'));
});

/* a workaround for: SystemJS builder doesn't create sub-folders automatically for css files */
gulp.task('mkdir', ['clean:js'], function() {
    return gulp.src(['app/lib', '!app/lib/**/*'], {base: 'app'})
        .pipe(gulp.dest('.build/'));
});

gulp.task('js', ['mkdir'], function (cb) {
    var builder = new Builder('app', './app/jspm.config.js');
    builder.config({
        separateCSS: true
    });
    builder.bundle('lib/main.ts', '.build/lib/main.js', {
        minify: true,
        mangle: false,
        sourceMaps: true
    }).then(function() {
        cb();
    });
});

gulp.task('zip', function () {
    gulp.src([".build/**/*"])
        .pipe(zip('ui.zip'))
        .pipe(gulp.dest('.dist'));
});

gulp.task('default', ['js', 'copy']);

gulp.task('webserver', [], function () {

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    gulp.src('app')
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
        configFile: './karma.conf.js',
        singleRun: true
    }, done).start();
});

