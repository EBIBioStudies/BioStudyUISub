'use strict';
module.exports=['AccessLevel', function(AccessLevel) {
    return {
        restrict: 'A',
        link: function($scope, element, attrs) {
            var display = element.css('display');

            $scope.$watch('currentUser', function(user) {
                updateCSS();
            }, true);

            attrs.$observe('accessLevel', function(value) {
                updateCSS(AccessLevel.get(value));
            });

            function updateCSS(accessLevel) {
                if(accessLevel) {

                    if(!$scope.isAuthorized(AccessLevel.roles(accessLevel))) {
                        element.css('display', 'none');
                    }
                    else {

                        element.css('display', prevDisp);
                    }
                }
            }

        }
    };
}];