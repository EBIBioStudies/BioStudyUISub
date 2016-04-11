'use strict';

angular.module('BioStudyApp')

    .factory('AuthService', require('./auth.service'))
    .factory('AccessLevel', require('./accessLevel.service'))
    .controller('SignInCtrl', require('./views/signin.ctrl'))
    .controller('SignUpCtrl', require('./views/signup.ctrl'))
    .controller('ActivateCtrl', require('./views/activate.ctrl'))
    .service('Session', ['USER_ROLES', function (USER_ROLES) {
        this.id = null;
        this.userName = null;
        this.userRole = null;

        function setValues(obj, id, userName, userRole) {
            obj.id = id;
            obj.userName = userName;
            obj.userRole = userRole;
        }

        function init(obj) {
            setValues(obj, null, null, USER_ROLES.public)
        }

        this.create = function (sessionId, userName, userRole) {
            setValues(this, sessionId, userName, userRole);
        };

        this.destroy = function () {
            init(this);
        };

        init(this);
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
