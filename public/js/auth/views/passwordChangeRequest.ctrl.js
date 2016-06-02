'use strict';

module.exports =
    (function () {
        return ['$scope', '$log', 'AuthService',
            function ($scope, $log, AuthService) {
                $scope.email = "";

                $scope.passwordReset = function () {
                    //TODO
                    $log.debug("password reset");
                }
            }];
    })();