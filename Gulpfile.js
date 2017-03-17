var gulp = require('gulp');
var debug = require('gulp-debug');

var webserver = require('gulp-webserver');
var zip = require('gulp-zip');
var bump = require('gulp-bump');
var del = require('del');
var extend = require('gulp-extend');
var Builder = require('jspm').Builder; //require('systemjs-builder');
var htmlreplace = require('gulp-html-replace');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var replace = require('gulp-replace');

var appConfig = require('./config.json');

var LessAutoprefixPlugin = require('less-plugin-autoprefix');
var autoprefix = new LessAutoprefixPlugin({browsers: ["last 2 versions"]});

gulp.task('ag-grid:copy', function() {
    return gulp.src(['node_modules/ag-grid/**/*'])
        .pipe(gulp.dest('app/jspm_packages/other/ag-grid/'));
});

gulp.task('ag-grid-ng2:copy', function() {
    return gulp.src(['node_modules/ag-grid-angular/**/*'])
        .pipe(gulp.dest('app/jspm_packages/other/ag-grid-angular/'));
});

gulp.task('ag-grid:json', function() {
    return gulp.src(['ag-grid/*.json'])
        .pipe(gulp.dest('app/jspm_packages/other/'));
});

/* workaround for jspm not been able to install ag-grid from npm */
gulp.task('init', gulp.series('ag-grid:copy', 'ag-grid-ng2:copy', 'ag-grid:json'));

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
        .pipe(gulp.dest('app/lib/config'));
});

gulp.task('clean', function () {
    return del([
        '.build'
    ]);
});

gulp.task('copy:images', function () {
    return gulp.src(['app/images/**/*'], {base: 'app'})
        .pipe(gulp.dest('.build/'));
});

gulp.task('copy:jspm_packages', function () {
    return gulp.src(['app/jspm_packages/**/*'], {base: 'app'})
        .pipe(gulp.dest('.build/'));
});

gulp.task('copy:jspm_config', function () {
    return gulp.src(['app/jspm.config.js'])
        .pipe(gulp.dest('.build/'));
});

gulp.task('copy:jspm_browser_config', function () {
    return gulp.src(['app/jspm.browser.js'])
        .pipe(replace(/"?baseURL"?\s*:\s*".*"/, `"baseURL": "${appConfig.APP_CONTEXT}"`))
        .pipe(gulp.dest('.build/'));
});


gulp.task('copy:index', function () {
    return gulp.src(['app/index.html', 'app/thor-integration.html'])
        .pipe(htmlreplace({
            'css': ['lib/main.css', 'lib/app.css'],
            'js': 'lib/main.js'
        }))
        .pipe(gulp.dest('.build/'));
});

gulp.task('copy:templates', function () {
    return gulp.src(['app/lib/**/*.html'])
        .pipe(gulp.dest('.build/lib/'));
});

gulp.task('copy', gulp.parallel('copy:images', 'copy:index', 'copy:jspm_packages', 'copy:jspm_config', 'copy:jspm_browser_config'));

/* a workaround for: SystemJS builder doesn't create sub-folders automatically for css files */
gulp.task('mkdir', function() {
    return gulp.src(['app/lib', '!app/lib/**/*'], {base: 'app'})
        .pipe(gulp.dest('.build/'));
});

gulp.task('js', gulp.series('mkdir', function (done) {
    var builder = new Builder();
    builder.config({
        separateCSS: true
    });
    builder.bundle('lib/main.ts', '.build/lib/main.js', {
        minify: true,
        mangle: false,
        sourceMaps: true
    }).then(function () {
        done();
    });
}));

gulp.task('css', function() {
    return gulp.src('app/styles/custom/custom-bootstrap.less')
        .pipe(sourcemaps.init())
        .pipe(less({
            plugins: [autoprefix]
         }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('.build/lib/app.css'));
});

gulp.task('zip', function () {
    return gulp.src([".build/**/*"])
        .pipe(zip('ui.zip'))
        .pipe(gulp.dest('.dist'));
});

gulp.task('default', gulp.series('clean', 'init', 'copy', 'js', 'css'));

gulp.task('webserver', function () {

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
        configFile: require('path').resolve('karma.conf.js'),
        singleRun: true
    }, done).start();
});

