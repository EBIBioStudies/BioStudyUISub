'use strict';

angular.module('BioStudyApp')

    .factory('AuthService', require('./auth.service'))
    .factory('AccessLevel', require('./accessLevel.service'))
    .controller('SignInCtrl', require('./views/signin.ctrl'))
    .controller('SignUpCtrl', require('./views/signup.ctrl'))
    .controller('ActivateCtrl', require('./views/activate.ctrl'))
    .service('Session', ['USER_ROLES', 'LocalStorage', function (USER_ROLES, LocalStorage) {
        this.id = null;
        this.userName = null;
        this.userRole = null;

        var SESSION_KEY = "SESSION_DATA";

        function setValues(obj, id, userName, userRole) {
            obj.id = id;
            obj.userName = userName;
            obj.userRole = userRole;
        }

        function setInitValues(obj) {
           setValues(obj, null, null, USER_ROLES.public);
        }

        this.init = function() {
            var data = LocalStorage.retrieve(SESSION_KEY);
            if (data != null) {
                setValues(this, data[0], data[1], data[2]);
                return;
            }
            setInitValues(this);
        };

        this.create = function (sessionId, userName, userRole) {
            setValues(this, sessionId, userName, userRole);
            LocalStorage.store(SESSION_KEY, [sessionId, userName, userRole]);
        };

        this.destroy = function () {
            setInitValues(this);
            LocalStorage.remove(SESSION_KEY);
        };

        this.isAnonymous = function () {
            return this.id === null;
        };

        this.init();
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
