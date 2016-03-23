'use strict';
var routing = require('../../../../.gen/config.json').routing;
var proxyRoute = routing.proxy;

module.exports = function ($scope, $routeParams, $http) {
    console.log('Route params defined:', $routeParams.key);
    $scope.hasError= false;
    $scope.message='';
    if (!$routeParams.key) {
        $scope.hasError= true;
        $scope.message='Wrong url for registration';
    } else {
        $http.post(proxyRoute.auth.activate.url, {'key':$routeParams.key})
            .success(function(data, status) {
                if (status===200) {
                    $scope.hasError= false;
                    $scope.message="Activation was sucessfull";

                } else {
                    $scope.hasError= true;
                    $scope.message="Activation link is not correct";
                }
            })
            .error(function(err, status) {
                console.log('activate', err, status);
                $scope.hasError=true;
                $scope.message="Activation link is not correct";

            });

    }


}