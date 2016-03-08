'use strict';
module.exports=function($rootScope, AuthService) {
    return {
        restrict: 'A',
        link: function($scope, element, attrs) {
            var prevDisp = element.css('display'),
                userRole,
                accessLevel;

            $scope.currentUser = AuthService.currentUser;
            $scope.$watch('currentUser', function(user) {
                if(user.role) {
                    userRole = user.role;
                }
                updateCSS('watch user');
            }, true);

            attrs.$observe('accessLevel', function(al) {
                if(al) {

                    //accessLevel = $scope.$eval(al);
                    accessLevel = AuthService.accessLevels[al] || AuthService.accessLevels.annon;

                }
                updateCSS('observer');
            });

            function updateCSS(wh) {

                if(userRole && accessLevel) {

                    if(!AuthService.authorize(accessLevel, userRole)) {
                        element.css('display', 'none');
                    }
                    else {

                        element.css('display', prevDisp);
                    }
                }
            }

        }
    };
};