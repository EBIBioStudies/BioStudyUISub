import tmpl from './tmpl/bsSection/section.html!ng-template'

class BsSectionController {
    constructor($scope, $log, _) {
        "ngInject";
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
            var colSizeCss = getColSizeCss(attributeKeys);

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

        function getColSizeCss(attributeKeys) {
            var length = attributeKeys.length;
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
    }
}

class BsSectionDirective {
    constructor() {
        Object.assign(this, {
            restrict: 'E',
            templateUrl: function (elem, attrs) {
                return attrs.templateUrl || tmpl.templateUrl;
            },
            require: "^^bsPanel",
            scope: {
                data: '=ngModel',
                dataType: '@type',
                changeCallback: '@change'
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
            controller: BsSectionController
        });
    }

    static create() {
        return new BsSectionDirective();
    }
}

export default BsSectionDirective.create;

