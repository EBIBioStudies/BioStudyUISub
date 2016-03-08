/**
 * Created by mdylag on 04/09/2014.
 */

'use strict';
module.exports = function(moduleDirective) {

    moduleDirective.directive('bsSection', function ($compile, $log, SubmissionService, TypeHeadService) {
        return {
            restrict: 'E',
            templateUrl: function(ell, attr) {
                if (attr.templateUrl) {
                    return templateUrl;
                } else {
                    return 'templates/bsng/section.html'

                }
            },
            scope: {
                labels: '=',
                sectionModel: '=',
                data: '=ngModel'
            },
            bindToController: {
                previewHeader: '@',
                previewBody: '@',//not used
                previewFooter: '@',//not used
                detailHeader: '@',
                detailBody: '@',  //not used
                detailFooter: '@' //not used

            },
            controllerAs: 'ctrl',
            controller: function ($scope) {

            },
            link: function ($scope, element, attrs, ctrl) {

                if (!$scope.labels) {
                    throw new Error('Attribute labels is required');
                }
                console.log('bSection--------------',$scope.data);
                /*var keysCount = $scope.data ? Object.keys($scope.data.attributesKey).length : 2;
                $scope.computeColumnSize = function () {
                    if (keysCount > 6) {
                        return 2;
                    } else {
                        return (12 / keysCount);
                    }
                }*/
                $scope.typeHead = $scope.labels.attributes;
                //TODO: Find a better way to scale fields in the preview
                //$scope.previewColSize = $scope.computeColumnSize();

            }
        };
    });

    moduleDirective.directive('bsReplaceEl',function($compile, $log) {
        return {
            restrict: 'EA',
            require: '^bsSection',
            scope: {
                data: '=ngModel',
                field: '=',
                labels: '=',
            },
            link: function ($scope, element, attrs, ctrl) {
                var templateUrl=element.attr('template-url');
                var id=element.attr('id');
                var model = '', elTmp = '';
                console.log('Scope data',$scope);
                if ($scope.data) {
                    model='ng-model="data"';
                }
                if ($scope.field) {
                    model= model + ' data-field="field"';
                }
                if ($scope.label) {
                    model= model + ' data-labels="field"';
                }

                if (ctrl[id]) {
                    elTmp='<bs-preview '+ model +' template-url=' + ctrl[id]  + '></bs-preview>'

                } else {
                    elTmp='<bs-preview '+ model + ' template-url=' + templateUrl + '></bs-preview>'
                }
                var node=$compile(elTmp)($scope);
                element.replaceWith(node);
            }
        }
    });

    moduleDirective.directive('bsPreview',function($compile, $log) {
        return {
            restrict: 'EA',
            require: '^bsSection',
            priority: 100,
            //transclude: true,
            scope: {
                data:'=ngModel',
                field: '=',
                labels: '=',
                sectionModel:'=',
                templateUrl: '@',

            },
            templateUrl: function(elem, attr) {
                if (!attr.templateUrl)
                    return "templates/bssection/bsPreview.html";
                return attr.templateUrl;
            }
        };

    });


    moduleDirective.directive('bsColSize',function($compile, $log) {
        return {
            restrict: 'AC',
            require: '^bsSection',
            scoep: {
                data: '=ngModel'
            },
            link: function ($scope, element, attrs, ctrl) {
            }
        }
    });


};


