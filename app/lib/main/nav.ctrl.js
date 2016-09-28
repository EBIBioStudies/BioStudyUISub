export default class NavController {
    constructor($scope) {
        $scope.isNavCollapsed = true;
        $scope.toggleCollapsed = () => {
            $scope.isNavCollapsed = !$scope.isNavCollapsed;
        };
    }
}