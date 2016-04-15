'use strict';
module.exports = ['AccessLevel', function (AccessLevel) {
    return {
        restrict: 'A',
        link: function ($scope, element, attrs) {
            var display = element.css('display');

            $scope.$watch($scope.currentUser,
                function () {
                    updateCSS();
                }, true);

            function updateCSS() {
                if (!$scope.isAuthorized(AccessLevel.roles(attrs.accessLevel))) {
                    element.css('display', 'none');
                }
                else {
                    element.css('display', display);
                }
            }
        }
    };
}];