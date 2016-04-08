'use strict';

module.exports =
    (function () {
        return ['$scope', '$rootScope', '$location', '$q', 'AuthService', function ($scope, $rootScope, $location, $q, AuthService) {
            $scope.hasError = false;
            $scope.error = {};
            $scope.credentials = {
                login: '',
                password: ''
            };

            $scope.showError = function () {
                return (($scope.hasError && !$scope.formUser.$pristine)
                || ($scope.hasError && $scope.formUser.$invalid && $scope.formUser.$dirty));
            };

            $scope.resetError = function () {
                $scope.hasError = false;
            };

            $scope.signIn = function (signInForm) {
                $scope.$broadcast('show-errors-check-validity');
                if ($scope.signInForm.$invalid) {
                    $scope.hasError = true;
                    $scope.error.message = "Username or password is empty";
                    return;
                }

                AuthService
                    .signIn($scope.credentials)
                    .then(function (res) {
                        $location.path('/submissions');
                        $scope.hasError = false;
                        $scope.error = {};

                    }).catch(function (error) {
                        $scope.hasError = true;
                        if (error) {
                            $scope.error.message = error.message;
                            $scope.error.status = error.status;
                        }
                    });
            };

        }];
    })();
