/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';

module.exports = function ($scope, $rootScope, $location, $q, AuthService) {
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

    $scope.signIn = function(userForm) {


        $scope.$broadcast('show-errors-check-validity');
        if ($scope.formUser.$invalid) {
            $scope.hasError=true;
            return;
        }

        var promise=AuthService.signIn(userForm);
        promise.then(function(res, currentUser) {
            $scope.$close('loginok');
            $location.path('/submissions');
            //}
            $scope.hasError = false;
            $scope.error = {};

        }).catch(function(error){
            $scope.hasError=true;
            $scope.error=error;

        });

    };

    $scope.close = function() {
        $scope.$dismiss('close');
        $location.path('/home');
    };
};
