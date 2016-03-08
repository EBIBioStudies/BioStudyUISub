/**
 * Created by mdylag on 04/09/2014.
 */

'use strict';

module.exports = function () {
    return {
        restrict: 'EA',
        require: '^form',
        scope: {
            name: '@'
        },
        templateUrl: 'templates/bsng/helpBlock.html',
        link: function ($scope, elem, attrs, ctrl) {
            $scope.isValid = function () {
                return ctrl[$scope.name].$valid;
            };
            $scope.isInvalid = function() {
                return ctrl[$scope.name].$error;
            };
            //formUser.username.$valid
        }
    };
};
