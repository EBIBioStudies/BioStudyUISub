import angular from 'angular'
import 'angular-messages'
//import uiRouter from 'angular-ui-router'
import 'angular-recaptcha'

import appStorage from '../localstorage/index'
import appORCID from '../orcid/index'

import AuthService from './services/auth.service'
import AccessLevelService from './services/accessLevel.service'
import SessionService from './services/session.service'

import ActivateCtrl from './pages/activate/activate.ctrl'
import SignUpCtrl from './pages/signup/signup.ctrl'
import SignInCtrl from './pages/signin/signin.ctrl'
import PasswordResetRequestCtrl from './pages/passwordReset/passwordResetRequest.ctrl'
import PasswordResetCtrl from './pages/passwordReset/passwordReset.ctrl'

import EqualsToDirective from './directives/equalsTo'
import AccessLevelDirective from './directives/accessLevel'


export default angular.module('BioStudyApp.Auth', [/*uiRouter,*/ 'ngMessages', 'vcRecaptcha', appStorage.name, appORCID.name])
    .service('AuthService', AuthService)
    .service('AccessLevel', AccessLevelService)
    .service('Session', SessionService)
    .constant('USER_ROLES', {
        public: 'role-public',
        user: 'role-user',
        admin: 'role-admin'
    })
    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })
    .controller('SignInCtrl', SignInCtrl)
    .controller('SignUpCtrl', SignUpCtrl)
    .controller('ActivateCtrl', ActivateCtrl)
    .controller('PasswordResetRequestCtrl', PasswordResetRequestCtrl)
    .controller('PasswordResetCtrl', PasswordResetCtrl)
    .directive('accessLevel', () => new AccessLevelDirective())
    .directive('equalsTo', () => new EqualsToDirective());