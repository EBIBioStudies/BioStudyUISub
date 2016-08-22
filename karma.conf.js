// Karma configuration
// Generated on Mon May 16 2016 11:10:10 GMT+0100 (BST)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: 'app',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: [
            'jspm',
            'jasmine'
        ],

        plugins: ['karma-jspm', 'karma-jasmine', 'karma-chrome-launcher'],

        jspm: {
            config: "jspm.config.js",
            packages: "jspm_packages",
            loadFiles: ['lib/**/*.Spec.js'],
            serveFiles: ['lib/**/*.js', 'lib/**/*.html', 'lib/**/*.json']
        },

        urlRoot: "/",
        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_ERROR,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [
            //'PhantomJS'
            'Chrome'
            // , 'Firefox'
            // , 'Safari'
        ],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    })
};
