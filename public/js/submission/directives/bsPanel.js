'use strict';

module.exports = function () {
    return {
        restrict: 'E',
        scope: {
            data: "=ngModel",
            dataType: "@type",
            contentUrl: "@contentUrl",
            changeHandler: "@change"
        },
        templateUrl: "templates/bsng/panel/panel.html",
        controllerAs: "panelCtrl",
        controller: ['$scope', 'DictionaryService', '_', '$log', function ($scope, DictionaryService, _, $log) {
            $scope.readOnly = $scope.$parent.$eval('readOnly') || false;

            $scope.onDataChange = function () {
                $log.debug("bsPanel notifyChanges");
                if ($scope.changeHandler) {
                    $scope.$parent.$eval($scope.changeHandler);
                }
            };

            $scope.dict = DictionaryService.byKey($scope.dataType);
            $scope.typeaheadKeys = _.map($scope.dict.attributes, function (attr) {
                return attr.name
            });
            $scope.typeaheadValues = function (attrName, itemIndex) {
                var attr = _.find($scope.dict.attributes, {name: attrName, typeahead: true});
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
                    if (item.attributes) {
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
                }
                return res;
            };

            var unwatch = $scope.$watch('data', function(newValue, oldValue) {
                if (newValue === undefined) {
                    return;
                }
                if (newValue.attributes) {
                    $scope.coll = newValue.attributes.attributes;
                    $scope.collWrapper = newValue.attributes;
                }

                if (newValue.items) {
                    $scope.coll = newValue.items;
                    $scope.collWrapper = newValue;
                }
                unwatch();
            });
        }]
    };
};



