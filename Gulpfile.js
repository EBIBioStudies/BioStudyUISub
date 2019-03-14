var gulp = require('gulp');
var zip = require('gulp-zip');
var del = require('del');

gulp.task('config', function () {
    return gulp.src(['config.json'])
        .pipe(gulp.dest('src'));
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

var Server = require('karma').Server;

gulp.task('test', function (done) {
    new Server({
        configFile: require('path').resolve('karma.conf.js'),
        singleRun: true
    }, done).start();
});