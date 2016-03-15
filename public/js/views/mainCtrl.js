/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';

module.exports = function ($scope, $rootScope,$location,$log, AuthService, AppInfo, $cookieStore, $timeout, $cookies) {

    var cookieDate =
    $scope.toggleMenuBtn=false;
    $scope.uisettings= {
        collapseLeftSide: false
    };
    $scope.toggleSidebar=false;
    $cookies.put('noSession', new Date(), {expires: new Date(2016,1,30)});
    //read it from cookie
    $scope.clickToggle=function() {
        $scope.toggleSidebar=!$scope.toggleSidebar;
    };

    $scope.$watch('collapseLeftSide', function() {
    });

    $scope.AppInfo=AppInfo;

    $scope.signIn = function(options) {
        AuthService.showSignInDialog(options || {});
    };

    $scope.signUp = function(options) {
        AuthService.showSignUpDialog(options || {});
    };

    $scope.signOut = function() {
        AuthService.signOut().then(function() {
            $location.path('/signin');
        }, function(err) {
            $location.path('/signin');
        });
    };


};
