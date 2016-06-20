/**
 * Created by mdylag on 04/09/2014.
 */

'use strict';

module.exports = function ($log) {
    return {
        restrict: 'E',
        scope: {
            item: '=ngModel',
            dataType: '@type',
            changeCallback: '@change',
            templateUrl: '@templateUrl'
        },
        require: ['?^^bsSection', '^^bsPanel'],
        template: '<ng-include src="getTemplateUrl()"/>',
        link: function (scope, element, attrs, ctrls) {
            var secCtrl = ctrls[0];
            var panelCtrl = ctrls[1];
            scope.sectionBinding = secCtrl != null;

            scope.readOnly = panelCtrl.readOnly;
            scope.dict = panelCtrl.dict(attrs.type);
            scope.typeaheadKeys = panelCtrl.typeaheadKeys(attrs.type);
            scope.typeaheadValues = panelCtrl.typeaheadValues(attrs.type);

            scope.getTemplateUrl = function () {
                return attrs.templateUrl;
            };

            var notifyChanges = function () {
                $log.debug("bsSectionItem notifyChanges");
                if (scope.changeCallback) {
                    scope.$parent.$eval(scope.changeCallback);
                }
            };

            scope.onAttributeChange = notifyChanges;

            var unwatch = scope.$watchCollection('item.attributes.attributes', notifyChanges);
            scope.$on('$destroy', function () {
                $log.debug("bsSectionItem on-destroy");
                unwatch();
            });
        }
    };
};
