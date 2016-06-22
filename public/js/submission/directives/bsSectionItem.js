/**
 * Created by mdylag on 04/09/2014.
 */

'use strict';

module.exports = function ($log, PUBMEDID_SEARCH_EVENTS) {
    return {
        restrict: 'E',
        scope: {
            item: '=ngModel',
            dataType: '@type',
            changeCallback: '@change'
        },
        templateUrl: function (elem, attrs) {
            return attrs.templateUrl || 'templates/bsng/sectionItem/sectionItem.html';
        },
        require: ['?^^bsSection', '^^bsPanel'],
        link: function (scope, element, attrs, ctrls) {
            var secCtrl = ctrls[0];
            var panelCtrl = ctrls[1];
            scope.sectionBinding = secCtrl != null;

            scope.readOnly = panelCtrl.readOnly;
            scope.dict = panelCtrl.dict(attrs.type);
            scope.typeaheadKeys = panelCtrl.typeaheadKeys(attrs.type);
            scope.typeaheadValues = panelCtrl.typeaheadValues(attrs.type);

            var notifyChanges = function () {
                $log.debug("bsSectionItem notifyChanges");
                if (scope.changeCallback) {
                    scope.$parent.$eval(scope.changeCallback);
                }
            };

            scope.onAttributeChange = notifyChanges;

            scope.$on(PUBMEDID_SEARCH_EVENTS.pubMedIdFound, function (event, data) {
                event.stopPropagation();
                $log.debug("onPubMedIdChange()", data);
                scope.item.attributes.update(data);
            });

            var unwatch = scope.$watchCollection('item.attributes.attributes', notifyChanges);
            scope.$on('$destroy', function () {
                $log.debug("bsSectionItem on-destroy");
                unwatch();
            });
        }
    };
};
