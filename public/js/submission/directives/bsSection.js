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
            require: "^^bsPanel",
            scope: {
                data: '=ngModel',
                dataType: '@type',
                changeCallback: '@change',
                sectionItemTemplateUrl: '@sectionItemTemplateUrl'
            },
            bindToController: {
                previewHeader: '@',
                detailsHeader: '@'
            },
            link: function(scope, elem, attrs, panelCtrl) {
                scope.readOnly = panelCtrl.readOnly;
                scope.dict = panelCtrl.dict(attrs.type);
                scope.typeaheadKeys = panelCtrl.typeaheadKeys(attrs.type);
                scope.typeaheadValues =  panelCtrl.typeaheadValues(attrs.type);
            },
            controllerAs: 'sectionCtrl',
            controller: ['$scope', '_', '$log', function ($scope, _, $log) {
                
                var notifyChanges = function () {
                    $log.debug("bsSection notifyChanges");
                    if ($scope.changeCallback) {
                        $scope.$parent.$eval($scope.changeCallback);
                    }
                };

                $scope.attributeKeys = [];
                $scope.colSizeCss= 'col-lg-6';

                function update(obj) {
                    var attributeKeys = getAttributeKeys(obj);
                    var colSizeCss = getColSizeCss(obj.fields, attributeKeys);

                    $scope.attributeKeys = attributeKeys;
                    $scope.colSizeCss = colSizeCss;
                }

                function getAttributeKeys(obj) {
                    var keys = {};
                    _.forEach(obj.items, function (item) {
                        _.forEach(item.attributes.attributes, function (attr) {
                            keys[attr.name] = 1;
                        });
                    });
                    return objProperties(keys);
                }

                function getColSizeCss(fields, attributeKeys) {
                    var length = fields.length + attributeKeys.length;
                    if (length > 6) {
                        length = 6;
                    }
                    return 'col-lg-' + Math.ceil(12 / length);
                }

                function objProperties(obj) {
                    var keys = [];
                    _.forOwn(obj, function(value, key) {
                        keys.push(key);
                    });
                    return keys;
                }

                $scope.onAttributeChange = function() {
                    $log.debug("bsSection onAttributeChange");
                    update($scope.data);
                    notifyChanges();
                };

                var unwatch = $scope.$watch('data', function(newValue, oldValue) {
                    if (newValue === undefined) {
                        return;
                    }
                    update(newValue);
                    unwatch();
                });

                var unwatchItems = $scope.$watchCollection('data.items', function(newValue, oldValue) {
                    if (newValue === undefined) {
                        return;
                    }
                    $log.debug("bsSection collection changed");
                    update($scope.data);
                    notifyChanges();
                });

                $scope.$on('$destroy', function () {
                    $log.debug("bsSection on-destroy");
                    unwatchItems();
                });
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
                scope.onAttributeChange = scope.$parent.onAttributeChange;
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
                scope.onAttributeChange = scope.$parent.onAttributeChange;
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


