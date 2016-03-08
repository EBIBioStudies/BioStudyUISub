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
    console.log('Main ctrl');
    //read it from cookie
    $scope.clickToggle=function() {
        $scope.toggleSidebar=!$scope.toggleSidebar;
    };

    $scope.$watch('collapseLeftSide', function() {
        console.log('Collapse change');
    });

    $scope.AppInfo=AppInfo;

    $scope.signIn = function(options) {
        AuthService.showSignInDialog(options || {});
    };

    $scope.signUp = function(options) {
        AuthService.showSignUpDialog(options || {});
    };

    $scope.signOut = function() {
        console.log('Sign out fun');
        AuthService.signOut().then(function() {
            console.log('Success signout');
            $location.path('/signin');
        }, function(err) {
            console.log('Sign out error ', err);
            $location.path('/signin');
        });
    };


};
