/**
 * Created by mdylag on 04/09/2014.
 */

'use strict';

module.exports = function ($log) {
    return {
        restrict: 'E',
        scope: {
            item: '=ngModel',
            changeHandler: '@change'
        },
        requires: ['?^^bsSection', '^^bsPanel'],
        templateUrl: function (elem, attrs) {
            return attrs.templateUrl;
        },
        controllerAs: 'sectionItemCtrl',
        controller: ['$scope', '$log', function ($scope, $log) {
            $scope.dict = $scope.$parent.dict;
            $scope.typeaheadKeys = $scope.$parent.typeaheadKeys;
            $scope.typeaheadValues = $scope.$parent.typeaheadValues;

            var notifyChanges = function () {
                $log.debug("bsSectionItem notifyChanges");
                if ($scope.changeHandler) {
                    $scope.$parent.$eval($scope.changeHandler);
                }
            };

            $scope.onAttributeChange = notifyChanges;

            var unwatch = $scope.$watchCollection('item.attributes.attributes', notifyChanges);
            $scope.$on('$destroy', function () {
                $log.debug("bsSectionItem on-destroy");
                unwatch();
            });
        }]
    };
};
