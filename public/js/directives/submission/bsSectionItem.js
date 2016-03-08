/**
 * Created by mdylag on 04/09/2014.
 */

'use strict';


module.exports = function ($compile, $log, SubmissionService, TypeHeadService) {
    return {
        restrict: 'E',
        templateUrl: function(elem, attrs) {
            return attrs.templateName;
        },
        transclude: true,
        scope: {
            submissionView:'=',
            data:'=ngModel',
            onDelete: '@',
            onAdd: '&',
            onAddAttr: '&',
            templateName: '@',
            typeHead: '='
        },
        link: function (scope, element, attrs, ctrl) {


            scope.typeHeadObj = TypeHeadService[scope.submissionView];
            console.log('Typehead', scope.data);
            scope.deleteItem = function(index, array) {
                console.log('Delete item ', index, array);
                if (array) {
                    SubmissionService.deleteElement(index, array);
                }

            };

            scope.addAttribute = function(parent) {
                console.log('Annotation', parent);
                if (parent) {
                    SubmissionService.addAttribute.call(parent);

                }


            };


        }
    };

};
