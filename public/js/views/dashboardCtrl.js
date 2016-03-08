/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';

module.exports = function ($scope, AuthService) {
    console.log('Dashboard');

    $scope.toggle=true;
    $scope.strech='strech';
    $scope.collapseLeft='collapse-left';
    $scope.user = {};
    $scope.user.firstName = 'Demo';
    $scope.user.lastName = 'Demo';
};
