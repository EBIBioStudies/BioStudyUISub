import tmpl from './tmpl/bsSectionItem/sectionItem.html!ng-template'

class BsSectionItemDirective {
    constructor($log, PUBMEDID_SEARCH_EVENTS) {

        Object.assign(this, {
            restrict: 'E',
            scope: {
                item: '=ngModel',
                dataType: '@type',
                changeCallback: '@change'
            },
            templateUrl: function (elem, attrs) {
                return attrs.templateUrl || tmpl.templateUrl;
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
        });
    }

    static create($log, PUBMEDID_SEARCH_EVENTS) {
        "ngInject";

        return new BsSectionItemDirective($log, PUBMEDID_SEARCH_EVENTS);
    }
}

export default BsSectionItemDirective.create;