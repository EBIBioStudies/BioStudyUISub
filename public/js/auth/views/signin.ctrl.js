'use strict';

module.exports =
    (function () {
        return ['$scope', '$rootScope', '$location', '$q', 'AuthService', 'AUTH_EVENTS',
            function ($scope, $rootScope, $location, $q, AuthService, AUTH_EVENTS) {
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

                $scope.signIn = function () {
                    $scope.$broadcast('show-errors-check-validity');
                    if ($scope.signInForm.$invalid) {
                        $scope.hasError = true;
                        $scope.error.message = "Username or password is empty";
                        return;
                    }

                    $scope.hasError = false;
                    $scope.error = {};

                    AuthService
                        .signIn($scope.credentials)
                        .then(function (data) {
                            if (data.status === "OK") {
                                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, data);
                                $location.path('/submissions');
                            } else {
                                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                                $scope.hasError = true;
                                $scope.error.message = data.message;
                                $scope.error.status = "FAIL";
                            }
                        });
                };

            }];
    })();
