/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';

module.exports = (function(){

    return ['$scope', '$rootScope', '$location', '$log', 'AuthService', 'AppInfo', 'USER_ROLES',
        function ($scope, $rootScope, $location, $log, AuthService, AppInfo, USER_ROLES) {

        $scope.currentUser = null;
        $scope.userRoles = USER_ROLES;
        $scope.isAuthorized = AuthService.isAuthorized;

        $scope.setCurrentUser = function (user) {
            $scope.currentUser = user;
        };

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

        $scope.AppInfo = AppInfo;

        $scope.signIn = function (options) {
            AuthService.showSignInDialog(options || {});
        };

        $scope.signUp = function (options) {
            AuthService.showSignUpDialog(options || {});
        };

        $scope.signOut = function () {
            AuthService.signOut().then(function () {
                $location.path('/signin');
            }, function (err) {
                $location.path('/signin');
            });
        };


    }];

})();



