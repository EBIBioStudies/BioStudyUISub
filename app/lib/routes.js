import uiRouter from 'angular-ui-router'

import submListTmpl from './submission/pages/list/submissionList.html!ng-template'
import submTmpl from './submission/pages/edit/submission.html!ng-template'
import signInTmpl from './auth/pages/signin/signin.html!ng-template'
import signUpTmpl from './auth/pages/signup/signup.html!ng-template'
import accActivateTmpl from './auth/pages/activate/activate.html!ng-template'
import accPasswordResetReqTmpl from './auth/pages/passwordReset/passwordResetRequest.html!ng-template'
import accPasswordResetTmpl from './auth/pages/passwordReset/passwordReset.html!ng-template'
import fileListTmpl from './file/pages/list/fileList.html!ng-template'
import helpTmpl from './help/help.html!ng-template'
import errorTmpl from './main/error.html!ng-template'

function routes($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('help', {
            url: '/help',
            templateUrl: helpTmpl.templateUrl,
            controller: 'HelpCtrl'
        })
        .state('key_activation', {
            url: '/activate/:key',
            templateUrl: accActivateTmpl.templateUrl,
            controller: 'ActivateCtrl'
        })
        .state('password_reset_request', {
            url: '/forgot_password',
            templateUrl: accPasswordResetReqTmpl.templateUrl,
            controller: 'PasswordResetRequestCtrl'
        })
        .state('password_reset', {
            url: '/password_reset/:key',
            templateUrl: accPasswordResetTmpl.templateUrl,
            controller: 'PasswordResetCtrl'
        })
        .state('signin', {
            url: '/signin',
            templateUrl: signInTmpl.templateUrl,
            controller: 'SignInCtrl'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: signUpTmpl.templateUrl,
            controller: 'SignUpCtrl'
        })
        .state('error', {
            url: '/error',
            templateUrl: errorTmpl.templateUrl,
            controller: 'ErrorCtrl'
        })
        .state('submissions', {
            url: '/submissions',
            templateUrl: submListTmpl.templateUrl,
            controller: 'SubmissionListCtrl',
            authenticated: true
        })
        .state('submission_edit', {
            url: '/edit/:accno',
            templateUrl: submTmpl.templateUrl,
            controller: 'SubmissionEditCtrl',
            authenticated: true
        })
        .state('submission_view', {
            url: '/view/:accno',
            templateUrl: submTmpl.templateUrl,
            controller: 'ViewSubmissionCtrl',
            authenticated: true
        })
        .state('files', {
            url: '/files?bb=true',
            templateUrl: fileListTmpl.templateUrl,
            controller: 'FileListCtrl',
            authenticated: true
        });
    /*.state('export', {
     url: '/export',
     templateUrl: 'partials/export.html',
     controller: 'ExportCtrl',
     authenticated: true
     })
     .state('profile', {
     url: '/profile',
     templateUrl: 'partials/profile.html',
     controller: 'ProfileCtrl'
     });*/

    // default url
    $urlRouterProvider.otherwise('/submissions');
}
export default angular.module('BioStudyApp.Routes', [uiRouter])
    .config(routes);