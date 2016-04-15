/*var jQuery=require('jquery');
 window.jQuery=jQuery;
 window.$=jQuery;

 var bootstrap=require('bootstrap/dist/js/bootstrap');
 */
'use strict';
//require('../../.build/components/ng-file-upload/angular-file-upload-shim');

//require('angular-animate/angular-animate');
//require('angular-sanitize/angular-sanitize');

//var msUi=require('../../.build/components/MentorSoftwareLtd/msNgUi/dist/index');

//require('../../.build/components/angular-file-upload/dist/angular-file-upload.min');
require('../../.build/components/ng-file-upload/ng-file-upload');
require('../../.build/components/angular-bootstrap/ui-bootstrap');
require('../../.build/components/angular-bootstrap/ui-bootstrap-tpls');
require('../../.build/components/angular-scroll/angular-scroll');
require('../../.build/components/typeahead-focus/typeahead-focus');
require('../../.build/components/angular-ui-select/dist/select');
require('../../.build/components/angular-bootstrap-show-errors');
require('../../.build/components/angular-recaptcha/release/angular-recaptcha');

var XML2JSON = require('../../shared/lib/xml2json');
//require('../../.build/components/angular-tree-dnd/dist/ng-tree-dnd');
require('./directives/tree-grid-directive');

var TrNgGrid = require('../../.build/components/trNgGrid/trNgGrid');

require('../../.gen/templates');


var app = angular.module('BioStudyApp',
    ['ngRoute', 'ngCookies', 'ngMessages', 'trNgGrid', 'ngFileUpload',
        'ui.bootstrap', 'ui.bootstrap.showErrors',
        'ui.select', 'typeahead-focus', 'bs-templates', 'treeGrid', 'vcRecaptcha'
    ]);
//'msAngularUi',
var appInfo = {
    version: require('../../package.json').version,
    configName: require('../../.gen/config.json').name
};
app.constant('AppInfo', appInfo);

require('./model');
require('./services');
require('./views/index');
require('./directives');
require('./auth');
require('./utils');

app
    .config(function ($routeProvider, $locationProvider, $logProvider, $httpProvider, $anchorScrollProvider) {

        //for tests only
        //delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $anchorScrollProvider.disableAutoScrolling();
        $logProvider.debugEnabled(true);

        // var access = require('./routeConfig').accessLevels;

        function isAuthorized(accessLevel, $q, AuthService) {
            var deferred = $q.defer();
            if (AuthService.isAuthorizedAs(accessLevel)) {
                deferred.reject({needsAuthentication: true});
            } else {
                deferred.resolve();
            }
            return deferred.promise;
        }

        $routeProvider.whenAuthenticated = function (path, route, accessLevel) {
            route.resolve = route.resolve || {};
            if (appInfo.configName !== 'dev') {
                angular.extend(route.resolve, {
                    isAuthorized: ['$q', 'AuthService',
                        function ($q, AuthService) {
                            return isAuthorized(accessLevel, $q, AuthService);
                        }]
                });
            }
            return $routeProvider.when(path, route);
        };
        $routeProvider.
            when('/help', {
                templateUrl: 'templates/views/help.html',
                controller: 'HelpCtrl'
            }).
            when('/activate/:key', {
                templateUrl: 'templates/auth/views/activate.html',
                controller: 'ActivateCtrl'
            }).
            when('/signin', {
                templateUrl: 'templates/auth/views/signin.html',
                controller: 'SignInCtrl'
            }).
            when('/signup', {
                templateUrl: 'templates/auth/views/signup.html',
                controller: 'SignUpCtrl'
            }).
            when('/error', {
                templateUrl: 'templates/views/error/error.html',
                controller: 'ErrorCtrl'
            }).
            whenAuthenticated('/submissions', {
                templateUrl: 'templates/views/submission/submissions.html',
                controller: 'SubmissionListCtrl'
            }, 'user').
            whenAuthenticated('/addsubmission', {
                templateUrl: 'templates/views/submission/submission.html',
                controller: 'AddSubmissionCtrl'
            }, 'user').
            whenAuthenticated('/edit/:accno', {
                templateUrl: 'templates/views/submission/submission.html',
                controller: 'EditSubmissionCtrl'
            }, 'user').
            whenAuthenticated('/edittemp/:accnotemp', {
                templateUrl: 'templates/views/submission/submission.html',
                controller: 'EditSubmissionCtrl'
            }, 'user').
            whenAuthenticated('/files', {
                templateUrl: 'templates/views/files/files.html',
                controller: 'FilesCtrl'
            }, 'user').
            whenAuthenticated('/export', {
                templateUrl: 'partials/export.html',
                controller: 'ExportCtrl'
            }, 'user').
            whenAuthenticated('/profile', {
                templateUrl: 'partials/profile.html',
                controller: 'ProfileCtrl'
            }, 'user').
            otherwise({
                redirectTo: '/submissions'
            });

        $locationProvider.html5Mode(false);

        $httpProvider.interceptors.push('sessionInterceptor');
        $httpProvider.interceptors.push('proxyInterceptor');
        $httpProvider.interceptors.push('authInterceptor');
    })

    .run(function ($location, $log, $rootScope, AuthService, AUTH_EVENTS, USER_ROLES, Session) {

        //TODO: it does not work ???
        //$anchorScroll.yOffset = 300;
        $rootScope.$on('$routeChangeError', function (ev, current, previous, rejection) {
            if (rejection && rejection.needsAuthentication === true) {
                console.log('needs auth change error');
                var returnUrl = $location.url();
                $location.path('/home');
                $rootScope.$broadcast('needsAuthentication', returnUrl);
            }
        });
        $rootScope.Constants = require('./Const');

        function logout() {
            $rootScope.setCurrentUser(null);
            $location.path('/signin');
        }

        $rootScope.$on(AUTH_EVENTS.notAuthenticated, logout);
        $rootScope.$on(AUTH_EVENTS.logoutSuccess, logout);
        $rootScope.$on(AUTH_EVENTS.sessionTimeout, logout);

        $rootScope.currentUser = null;
        $rootScope.userRoles = USER_ROLES;
        $rootScope.isAuthorized = AuthService.isAuthorized;

        $rootScope.setCurrentUser = function (user) {
            $rootScope.currentUser = user;
        };

        if (!Session.isAnonymous()) {
            $rootScope.setCurrentUser(Session.userName);
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
    .factory('proxyInterceptor', function () {
        return {
            'request': function (config) {
                var url = config.url;
                if (url.startsWith('/api/') || url.startsWith('/raw/')) {
                    config.url = "/proxy" + url;
                }
                return config;
            }
        };
    })
    .factory('sessionInterceptor', ['Session', function (Session) {
        return {
            'request': function (config) {
                if (!Session.isAnonymous()) {
                    config.headers['x-session-token'] = Session.id;
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


