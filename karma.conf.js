// Karma configuration
// Generated on Mon May 16 2016 11:10:10 GMT+0100 (BST)

module.exports = function (config) {
    var configuration = {

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: './app',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: [
            'jspm',
            'jasmine'
        ],

        plugins: ['karma-uiuxengineering-jspm', 'karma-jasmine', 'karma-chrome-launcher'],

        jspm: {
            jspmConfig: 'jspm.config.js',
            browserConfig: 'jspm.browser.js',
            packages: 'jspm_packages',
            adapter: 'angular2',
            files: [
                'app/app/**/*.ts',
                'app/app/**/*.html',
                'app/app/**/*.json'
            ]
        },

        // must have path roots of serveFiles and loadFiles, suppress annoying 404 warnings.
        proxies: {
            '/lib/': '/base/lib/',
            '/jspm_packages/': '/base/jspm_packages/'
        },

        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'app/**/!(*.spec).ts': ['jspm']
        },
        /*
         proxies: {
         '/': '/app'
         },
         */

        //urlRoot: "/",
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
        logLevel: config.LOG_WARN,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [
            //'PhantomJS'
            'Chrome',
            // , 'Firefox'
            // , 'Safari'
        ],

        customLaunchers: {
            chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        browserNoActivityTimeout: 3000000
    };

    if (process.env.TRAVIS) {
        configuration.browsers = ['chrome_travis_ci'];
    }

    config.set(configuration);
};
