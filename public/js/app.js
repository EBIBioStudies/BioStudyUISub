'use strict';

require('../../.build/components/ng-file-upload/ng-file-upload');
require('../../.build/components/angular-bootstrap/ui-bootstrap');
require('../../.build/components/angular-bootstrap/ui-bootstrap-tpls');
require('../../.build/components/angular-scroll/angular-scroll');
require('../../.build/components/typeahead-focus/typeahead-focus');
require('../../.build/components/angular-ui-select/dist/select');
require('../../.build/components/angular-bootstrap-show-errors');
require('../../.build/components/angular-recaptcha/release/angular-recaptcha');
require('../../.build/components/angular-ui-router/release/angular-ui-router');

var XML2JSON = require('../../shared/lib/xml2json');
require('./directives/tree-grid-directive');

var TrNgGrid = require('../../.build/components/trNgGrid/trNgGrid');

require('../../.gen/templates');
require('./config');

var app = angular.module('BioStudyApp',
    [
        'BioStudyApp.config',
        'ngCookies', 'ngMessages', 'trNgGrid', 'ngFileUpload',
        'ui.bootstrap', 'ui.bootstrap.showErrors',
        'ui.select', 'typeahead-focus', 'bs-templates', 'treeGrid', 'vcRecaptcha', 'ui.router'
    ]);

require('./model');
require('./services');
require('./views/index');
require('./directives');
require('./auth');
require('./submission');
require('./utils');

app
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $logProvider, $httpProvider, $anchorScrollProvider) {

        //for tests only
        //delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $anchorScrollProvider.disableAutoScrolling();
        $logProvider.debugEnabled(true);

        $stateProvider
            .state('help', {
                url: '/help',
                templateProvider: 'templates/views/help.html',
                controller: 'HelpCtrl'
            })
            .state('key_activation', {
                url: '/activate/:key',
                templateUrl: 'templates/auth/views/activate.html',
                controller: 'ActivateCtrl'
            })
            .state('signin', {
                url: '/signin',
                templateUrl: 'templates/auth/views/signin.html',
                controller: 'SignInCtrl'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'templates/auth/views/signup.html',
                controller: 'SignUpCtrl'
            })
            .state('error', {
                url: '/error',
                templateUrl: 'templates/views/error/error.html',
                controller: 'ErrorCtrl'
            })
            .state('submissions', {
                url: '/submissions',
                templateUrl: 'templates/submission/views/submissions.html',
                controller: 'SubmissionListCtrl',
                authenticated: true
            })
            .state('submission_edit', {
                url: '/edit/:accno',
                templateUrl: 'templates/submission/views/submission.html',
                controller: 'EditSubmissionCtrl',
                authenticated: true
            })
            .state('files', {
                url: '/files',
                templateUrl: 'templates/views/files/files.html',
                controller: 'FilesCtrl',
                authenticated: true
            })
            .state('export', {
                url: '/export',
                templateUrl: 'partials/export.html',
                controller: 'ExportCtrl',
                authenticated: true
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'partials/profile.html',
                controller: 'ProfileCtrl'
            });

        // default url
        $urlRouterProvider.otherwise('/submissions');

        $locationProvider.html5Mode(false);

        $httpProvider.interceptors.push('sessionInterceptor');
        $httpProvider.interceptors.push('proxyInterceptor');
        $httpProvider.interceptors.push('authInterceptor');
    })

    .run(function ($state, $log, $rootScope, AuthService, AUTH_EVENTS, USER_ROLES, Session) {

        // Redirect to login if route requires auth and you're not logged in
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            if (toState.authenticated && !AuthService.isAuthenticated()) {
                event.preventDefault();
                $rootScope.returnToState = toState.url;
                $rootScope.returnToStateParams = toParams;
                $state.transitionTo('signin');
            }
        });

        $rootScope.Constants = require('./Const');

        function setCurrentUser(user) {
            $rootScope.currentUser = user;
        }

        function logout() {
            setCurrentUser(null);
            $state.go('signin');
        }

        function login(event, data) {
            setCurrentUser(data.username);
        }

        $rootScope.$on(AUTH_EVENTS.notAuthenticated, logout);
        $rootScope.$on(AUTH_EVENTS.sessionTimeout, logout);
        $rootScope.$on(AUTH_EVENTS.logoutSuccess, logout);
        $rootScope.$on(AUTH_EVENTS.loginSuccess, login);

        $rootScope.currentUser = null;
        $rootScope.userRoles = USER_ROLES;
        $rootScope.isAuthorized = AuthService.isAuthorized;

        if (!Session.isAnonymous()) {
            setCurrentUser(Session.userName);
        }
    })
    .factory('authInterceptor', ['$rootScope', '$q', 'AUTH_EVENTS', function ($rootScope, $q, AUTH_EVENTS) {
        return {
            responseError: function (response) {
                $rootScope.$broadcast({
                    401: AUTH_EVENTS.notAuthenticated,
                    403: AUTH_EVENTS.notAuthorized,
                    419: AUTH_EVENTS.sessionTimeout,
                    440: AUTH_EVENTS.sessionTimeout
                }[response.status], response);
                return $q.reject(response);
            }
        };
    }])
    .factory('proxyInterceptor', ['APP_PROXY_BASE', function (APP_PROXY_BASE) {
        return {
            'request': function (config) {
                var url = config.url;
                if (url.startsWith('/api/') || url.startsWith('/raw/')) {
                    config.url = APP_PROXY_BASE + url;
                }
                return config;
            }
        };
    }])
    .factory('sessionInterceptor', ['Session', function (Session) {
        return {
            'request': function (config) {
                if (!Session.isAnonymous()) {
                    config.headers['X-Session-Token'] = Session.id;
                }
                return config;
            }
        };
    }])
    .value('Xml2Json', XML2JSON)
    .factory('SharedData', function () {
        var submission = {};
        return {
            setSubmission: function (sbm) {
                submission = sbm;
            },
            getSubmission: function () {
                return submission;
            }
        }
    })
    .filter("releaseDateFormat", function ($filter) {
        return function (fieldValueUnused, item) {
            console.log(Number.isInteger(parseInt(item.rtime)));
            var rtime = parseInt(item.rtime);
            if (Number.isInteger(rtime)) {
                return $filter('date')(new Date(rtime * 1000), 'dd-MMM-yyyy')
            } else if (item.rtime) {
                return new Date(item.rtime);
            }
        };
    })
    .filter("filterAttrKeys", function ($filter) {
        return function (fieldValueUnused, array, existedKeys) {
            //console.log('Attributes filter', array, existedKeys);
            var typeHead = [];
            for (var i in array) {
                if (!existedKeys[array[i].name]) {
                    typeHead.push(array[i]);
                }
            }
            return typeHead;
        };
    });


