'use strict';

module.exports =
    (function () {
        return ['$scope', '$routeParams', 'AuthService',
            function ($scope, $routeParams, AuthService) {
                console.log('Route params defined:', $routeParams.key);
                $scope.hasError = false;
                $scope.message = '';
                if (!$routeParams.key) {
                    $scope.hasError = true;
                    $scope.message = 'Wrong url for registration';
                } else {
                    AuthService.activate($routeParams.key)
                        .then(function () {
                            $scope.hasError = false;
                            $scope.message = "Activation was successful";
                        })
                        .catch(function () {
                            $scope.hasError = true;
                            $scope.message = "Activation link is not correct";
                        });
                }
            }];
    })();