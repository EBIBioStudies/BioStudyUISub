/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';

module.exports = (function(){

    return ['$scope', '$rootScope', '$location', '$log', 'AuthService', 'APP_VERSION', 'AUTH_EVENTS',
        function ($scope, $rootScope, $location, $log, AuthService, APP_VERSION, AUTH_EVENTS) {

            $scope.toggleMenuBtn = false;
            $scope.uisettings = {
                collapseLeftSide: false
            };
            $scope.toggleSidebar = false;

            //read it from cookie
            $scope.clickToggle = function () {
                $scope.toggleSidebar = !$scope.toggleSidebar;
            };

            $scope.$watch('collapseLeftSide', function () {
            });

            $scope.appVersion = APP_VERSION;

            $scope.signIn = function (options) {
                AuthService.showSignInDialog(options || {});
            };

            $scope.signUp = function (options) {
                AuthService.showSignUpDialog(options || {});
            };

            $scope.signOut = function () {
                AuthService.signOut().then(function () {
                    $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
                });
            };
        }];

})();