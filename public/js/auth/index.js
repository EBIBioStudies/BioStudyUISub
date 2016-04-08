'use strict';

angular.module('BioStudyApp')

    .factory('AuthService', require('./auth.service'))
    .controller('SignInCtrl', require('./views/signin.ctrl'))
    .controller('SignUpCtrl', require('./views/signup.ctrl'))
    .controller('ActivateCtrl', require('./views/activate.ctrl'))
    .service('Session', ['USER_ROLES', function (USER_ROLES) {
        this.create = function (sessionId, userName, userRole) {
            this.id = sessionId;
            this.userName = userName;
            this.userRole = userRole;
        };
        this.destroy = function () {
            this.id = null;
            this.userName = null;
            this.userRole = USER_ROLES.public;
        };
    }])
    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })
    .constant('USER_ROLES', {
        public: 'role-public',
        user: 'role-user',
        admin: 'role-admin'
    });
