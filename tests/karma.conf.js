'use strict';

module.exports = function(karma) {

    karma.set({
        files: [
            '.build/components/angular/angular.js',
            '.build/components/angular-route/angular-route.js',
            '.build/components/angular-cookies/angular-cookies.js',
            '.build/components/angular-messages/angular-messages.js',
            '.build/components/angular-mocks/angular-mocks.js',
            'public/js/app.js',
            'public/js/**/*Spec.js'
        ],
        basePath: '../',
        frameworks: [ 'jasmine', 'browserify' ],

        reporters: [ 'dots' ],

        preprocessors: {
            'public/js/app.js':['browserify'],
            'public/js/**/*Spec.js' : [ 'browserify' ]
        },

        browsers: [ 'Chrome' ],

        logLevel: 'LOG_DEBUG',

        singleRun: true,
        autoWatch: false,

        // browserify configuration
        browserify: {
            watch:true,
            debug: true,
            transform: [ 'brfs' ],
            bundleDelay: 1750
        }
    });
};
