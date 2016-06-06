'use strict';

module.exports =
    (function () {
        return ['$scope', '$log', '$stateParams', 'AuthService',
            function ($scope, $log, $stateParams, AuthService) {
                $scope.password1 = "";
                $scope.password2 = "";
                $scope.key = $stateParams.key;
                    
                $scope.changePassword = function () {
                    //TODO
                    $log.debug("password change");
                }
            }];
    })();