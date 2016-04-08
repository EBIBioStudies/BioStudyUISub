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
require('./home');
require('./submission');

app.config(function ($routeProvider, $locationProvider, $logProvider, $httpProvider, $anchorScrollProvider) {

    //for tests only
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $anchorScrollProvider.disableAutoScrolling();
    $logProvider.debugEnabled(true);

    var access = require('./routeConfig').accessLevels;

    function checkSignedIn($q, $log, AuthService) {
        var deferred = $q.defer();
        if (!AuthService.isSignedIn()) {
            deferred.reject({needsAuthentication: true});
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    }

    $routeProvider.whenAuthenticated = function (path, route, accessLevel) {
        route.resolve = route.resolve || {};
        //app.constant(path,accessLevel);
        //User service to register accesslevels for paths.
        console.log(appInfo.configName);
        //TEST IT for TEST and PROD
        if (appInfo.configName !== 'dev') {
            angular.extend(route.resolve, {isSignedIn: ['$q', '$log', 'AuthService', checkSignedIn]});
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
            templateUrl: 'templates/submission/views/submissions.html',
            controller: 'SubmissionListCtrl'
        }, access.user).
        whenAuthenticated('/addsubmission', {
            templateUrl: 'templates/views/submission/submission.html',
            controller: 'AddSubmissionCtrl'
        }, access.user).
        whenAuthenticated('/edit/:accno', {
            templateUrl: 'templates/views/submission/submission.html',
            controller: 'EditSubmissionCtrl'
        }, access.user).
        whenAuthenticated('/edittemp/:accnotemp', {
            templateUrl: 'templates/views/submission/submission.html',
            controller: 'EditSubmissionCtrl'
        }, access.user).
        whenAuthenticated('/files', {
            templateUrl: 'templates/views/files/files.html',
            controller: 'FilesCtrl'
        }, access.user).
        whenAuthenticated('/export', {
            templateUrl: 'partials/export.html',
            controller: 'ExportCtrl'
        }, access.user).
        whenAuthenticated('/profile', {
            templateUrl: 'partials/profile.html',
            controller: 'ProfileCtrl'
        }, access.user).
        otherwise({
            redirectTo: '/signin'
        });
    $locationProvider
        .html5Mode(false);
    $httpProvider.interceptors.push('authInterceptor');

})
    .run(function ($location, $log, $rootScope, $q, $locale, $anchorScroll, AuthService) {

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

        $rootScope.$on('needsAuthentication', function (ev, current, previous, rejection) {
            console.log('needs auth');

            var options = {currentUrl: current};
            $location.path('/signin');
        });

        $rootScope.$watch('user', function (newValue, oldValue) {
        });


    })
    .factory('authInterceptor', function ($rootScope, $q, $log, $cookieStore, $location, ErrorService) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                if ($cookieStore.get('token')) {
                    config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
                }
                return config;
            },

            responseError: function (response) {
                ErrorService.addError({
                    status: response.status,
                    message: response.statusText,
                    url: response.config.url,
                    path: $location.path()
                });
                if ($location.path() !== "/signup" && $location.path() !== "/signin" && $location.path().indexOf("/activate") === -1) {
                    //$log.debug('auth interceptor error', $location.path().indexOf("/activate");
                    //show sign in page
                    $location.path('/error');
                    $cookieStore.remove('token');

                    return $q.reject(response);
                }
                else {
                    return $q.reject(response);
                }
            }
        };
    })
    .value('Xml2Json', XML2JSON)
    .factory('SharedData', function() {
        var submission = {};
        return {
            setSubmission: function(sbm) {
                submission = sbm;
            },
            getSubmission: function() {
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
            //console.log('Attributes filter', value, attributes);
            var typeHead = [];
            for (var i in array) {
                if (!existedKeys[array[i].name]) {
                    typeHead.push(array[i]);
                }
            }
            return typeHead;
        };
    });
;


