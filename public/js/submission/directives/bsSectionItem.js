/**
 * Created by mdylag on 04/09/2014.
 */

'use strict';

module.exports = function (DictionaryService) {
    return {
        restrict: 'E',
        templateUrl: function (elem, attrs) {
            return attrs.templateUrl;
        },
        scope: {
            data: '=ngModel'
        },
        link: function (scope, element, attrs) {
            scope.dict = DictionaryService.byKey(attrs.type);
        }
    };
};
