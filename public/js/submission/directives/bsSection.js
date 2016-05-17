/**
 * Created by mdylag on 04/09/2014.
 */

'use strict';

module.exports = function (moduleDirective) {

    moduleDirective.directive('bsSection', function () {
        return {
            restrict: 'E',
            templateUrl: function (elem, attrs) {
                return attrs.templateUrl || 'templates/bsng/section.html';
            },
            scope: {
                data: '=ngModel',
                dataType: '@type'
            },
            bindToController: {
                previewHeader: '@',
                detailsHeader: '@'
            },
            controllerAs: 'ctrl',
            controller: ['$scope', 'DictionaryService', function ($scope, DictionaryService) {
                $scope.dict = DictionaryService.byKey($scope.dataType);
                $scope.typeahead = $scope.dict.attributes;
            }]
        };
    });

    moduleDirective.directive('bsPreviewHeader', function () {
        return {
            restrict: 'E',
            require: '^bsSection',
            scope: {
                data: '=ngModel',
                field: '=',
                dict: '='
            },
            template: "<ng-include src='template'></ng-include>",
            link: function (scope, element, attrs, ctrl) {
                scope.template = ctrl.previewHeader || 'templates/bsng/section_part/previewHeader.html';
            }
        };

    });

    moduleDirective.directive('bsDetailsHeader', function () {
        return {
            restrict: 'E',
            require: '^bsSection',
            scope: {
                data: '=ngModel',
                field: '=',
                dict: '='
            },
            template: "<ng-include src='template'></ng-include>",
            link: function (scope, element, attrs, ctrl) {
                scope.template = ctrl.detailsHeader || 'templates/bsng/section_part/detailsHeader.html';
            }
        };
    });

    moduleDirective.filter('filterAttrs', function () {
        return function (fieldValueUnused, array, key) {
            var ret = [];
            for (var i in array) {
                if (array[i].name === key) {
                    ret.push(array[i]);
                    return ret;
                }
            }
            return ret;
        };
    });

    moduleDirective.filter("filterAttrsTypeahead", function () {
        return function (fieldValueUnused, array, existedKeys) {
            var typeahead = [];
            for (var i in array) {
                var index = _.findIndex(existedKeys, {name: array[i].name})
                if (index === -1) {
                    typeahead.push(array[i]);
                }
            }
            return typeahead;
        };
    });

    moduleDirective.directive('bsWatch', function () {
        return {
            restrict: 'A',
            require: '^ngModel',
            scope: {
                bsWatch: '='
            },
            link: function (scope, element, attrs, ctrl) {
                console.log('bs', scope, attrs, ctrl);
            }
        }
    });

    moduleDirective.filter("filterDifference", function () {
        return function (fieldValueUnused, array, existedKeys) {
            return _.differenceBy(array, existedKeys, 'name');
        };
    });

};


