/**
 * Created by mdylag on 04/09/2014.
 */

'use strict';

module.exports = function (moduleDirective) {

    moduleDirective.directive('bsSection', function () {
        return {
            restrict: 'E',
            templateUrl: function (elem, attrs) {
                return attrs.templateUrl || 'templates/bsng/section/section.html';
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
            controller: ['$scope', 'DictionaryService', '_', function ($scope, DictionaryService, _) {
                $scope.dict = DictionaryService.byKey($scope.dataType);
                $scope.typeaheadKeys = _.map($scope.dict.attributes, function(attr) {return attr.name});
                $scope.typeaheadValues = function (attrName, itemIndex) {
                    var attr = _.find($scope.dict.attributes, { name: attrName, typeahead: true});
                    if (!attr) {
                        return [];
                    }
                    var set = {};
                    var res = [];
                    var items = $scope.data.items;
                    for (var j = 0; j < items.length; j++) {
                        if (j === itemIndex) {
                            continue;
                        }
                        var item = items[j];
                        var attrs = item.attributes.attributes;
                        for (var i = 0; i < attrs.length; i++) {
                            var attr = attrs[i];
                            if (attr.name === attrName && attr.value) {
                                if (set[attr.value] != 1) {
                                    res.push(attr.value);
                                    set[attr.value] = 1;
                                }
                                break;
                            }
                        }
                    }
                    return res;
                }
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
                scope.template = ctrl.previewHeader || 'templates/bsng/section/previewHeader.html';
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
                scope.template = ctrl.detailsHeader || 'templates/bsng/section/detailsHeader.html';
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


