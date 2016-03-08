/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';

module.exports = function ($rootScope, $scope, ErrorService) {
    $scope.error = ErrorService.errors;
    $scope.path="#/submissions";
    $scope.pathMessage='return to list of submissions';
    $scope.pathPrefixMessage='Meanwhile, you may ';

    if ($scope.error.status==404) {
        $scope.error.message="We could not find the "+ $scope.error.url +" resource you were looking for.";
    } else if ($scope.error.status==401) {
        $scope.path="#/signin";
        $scope.pathPrefixMessage="You can try ";
        $scope.pathMessage='try to sign in again';
    }
    else {
       $scope.error.message="We will work on fixing that right away." + $scope.error.message;
    }
};
