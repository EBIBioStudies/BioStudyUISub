/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';

module.exports = function ($scope, $rootScope, $location, $q, AuthService, MessageService) {
    $scope.hasError=false;
    $scope.error={};

    $scope.showError = function() {

        if (($scope.hasError && !$scope.formUser.$pristine) || ($scope.formUser.$invalid && $scope.formUser.$dirty && $scope.hasError)) {
            return true;
        }
        return false;
    };

    $scope.resetError = function() {
        $scope.hasError = false;
    };

    $scope.signIn = function(signInForm) {

        $scope.$broadcast('show-errors-check-validity');
        if ($scope.signInForm.$invalid) {
            $scope.hasError=true;
            $scope.error.message="Username or password is empty";
            return;
        }

        var promise=AuthService.signIn($scope.user);
        promise.then(function(res, currentUser) {
            $location.path('/submissions');
            $scope.hasError = false;
            $scope.error = {};

        }).catch(function(error){
            console.log('error', error);
            $scope.hasError=true;
            if (error) {
                $scope.error.message=error.message;
                $scope.error.status=error.status;

            }

        });

    };

};
