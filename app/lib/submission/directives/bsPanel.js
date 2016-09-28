import tmpl from './tmpl/bsPanel/panel.html!ng-template'
import sectionItemTmpl from  './tmpl/bsPanel/sectionItem_content.html!ng-template'
import sectionTmpl from './tmpl/bsPanel/section_content.html!ng-template'
import fileSectionTmpl from './tmpl/bsPanel/file/section_content.html!ng-template'

const defaultContentType = 'section';
const contentTemplates = {
    'section': sectionTmpl.templateUrl,
    'sectionItem': sectionItemTmpl.templateUrl,
    'fileSection': fileSectionTmpl.templateUrl
};

class BsPanelController {
    constructor($scope, DictionaryService, _, $log) {
        "ngInject";

        function contentUrlFor(contentType) {
            if (!contentTemplates.hasOwnProperty(contentType)) {
                $log.error("Unknown content-type value for a bs-panel: " + contentType);
                contentType = defaultContentType;
            }
            return contentTemplates[contentType];
        }

        this.readOnly = $scope.$parent.$eval('readOnly') || false;

        this.dict = function (dataType) {
            return DictionaryService.byKey(dataType);
        };

        this.typeaheadKeys = function (dataType) {
            return _.map(
                _.filter(this.dict(dataType).attributes,
                    function (attr) {
                        return attr.required !== true
                    }),
                function (attr) {
                    return attr.name
                });
        };

        this.typeaheadValues = function (dataType) {
            var attributes = this.dict(dataType).attributes;
            return function (attrName, itemIndex) {
                var attr = _.find(attributes, {name: attrName, typeahead: true});
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
        };

        $scope.contentUrl = contentUrlFor($scope.contentType);

        $scope.onDataChange = function () {
            $log.debug("bsPanel notifyChanges");
            if ($scope.changeCallback) {
                $scope.$parent.$eval($scope.changeCallback);
            }
        };

        $scope.dict = this.dict($scope.dataType);
        $scope.readOnly = this.readOnly;

        var unwatch = $scope.$watch('data', function (data) {
            if (data === undefined) {
                return;
            }
            if (data.attributes) {
                $scope.coll = data.attributes.attributes;
                $scope.collWrapper = data.attributes;
            }

            if (data.items) {
                $scope.coll = data.items;
                $scope.collWrapper = data;
            }
            unwatch();
        });

    }
}

class BsPanelDirective {
    constructor() {
        Object.assign(this, {
            restrict: 'E',
            scope: {
                data: "=ngModel",
                dataType: "@type",
                contentType: "@contentType",
                changeCallback: "@change"
            },
            templateUrl: tmpl.templateUrl,
            controllerAs: "panelCtrl",
            controller: BsPanelController
        });
    }

    static create() {
        return new BsPanelDirective();
    }
}

export default BsPanelDirective.create;
