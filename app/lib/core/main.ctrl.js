export default class MainController {
    constructor($scope, $rootScope, AuthService, APP_VERSION, AUTH_EVENTS) {
        'ngInject';

        $scope.toggleMenuBtn = false;
        $scope.uisettings = {
            collapseLeftSide: false
        };
        $scope.toggleSidebar = false;

        $scope.clickToggle = function () {
            $scope.toggleSidebar = !$scope.toggleSidebar;
        };

        $scope.$watch('collapseLeftSide', function () {
        });

        $scope.appVersion = APP_VERSION;

        $scope.signOut = function () {
            AuthService.signOut().then(function () {
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            });
        };
    }
}