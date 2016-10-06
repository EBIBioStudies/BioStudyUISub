import 'zone.js';
import 'reflect-metadata';

import angular from 'angular'
import { upgradeAdapter } from './upgrade_adapter';

///import '../styles/app.less!less'

import uiRouter from 'angular-ui-router'

import appNav from './nav/index'

import appConfig from './config'
//import appRoutes from './routes'
import appAuth from './auth/index'
import appSubmission from './submission/index'
import appFile from './file/index'
import appMain from './main/index'
import appHelp from './help/index'


const appName = 'BioStudyApp';

angular.module(appName,
    [
        uiRouter,
        appNav.name,
        appMain.name,
        appConfig.name,
       // appRoutes.name,
        appAuth.name,
        appSubmission.name,
        appFile.name,
        appHelp.name
    ])
    .config(function ($locationProvider, $logProvider, $httpProvider, $anchorScrollProvider, APP_DEBUG_ENABLED) {

        $anchorScrollProvider.disableAutoScrolling();
        $logProvider.debugEnabled(APP_DEBUG_ENABLED === true);

        //$locationProvider.html5Mode(false);

        $httpProvider.interceptors.push('sessionInterceptor');
        $httpProvider.interceptors.push('proxyInterceptor');
        $httpProvider.interceptors.push('authInterceptor');
    })
    .run(function ($state, $log, $rootScope, AuthService, AUTH_EVENTS, USER_ROLES, Session) {

        // Redirect to login if route requires auth and you're not logged in
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            if (toState.authenticated && !AuthService.isAuthenticated()) {
                event.preventDefault();
                $rootScope.returnToState = toState;
                $rootScope.returnToStateParams = toParams;
                $state.transitionTo('signin');
            }
        });

        function setCurrentUser(user) {
            $rootScope.currentUser = angular.isString(user) ? (user || "NO_NAME") : user;
        }

        function logout() {
            $log.debug('logout() called');
            setCurrentUser();
            Session.destroy();
            $state.go('signin');
        }

        function login(event, data) {
            $log.debug('login() called');
            setCurrentUser(data.username);
            if ($rootScope.returnToState) {
                $state.go($rootScope.returnToState, $rootScope.returnToStateParams);
            } else {
                $state.go('submissions');
            }
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


angular.element(document).ready(() => {
    upgradeAdapter.bootstrap(document.body, [appName]);
});
