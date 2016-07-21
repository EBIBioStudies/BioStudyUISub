export default class ActivateController {
    constructor($scope, $stateParams, AuthService) {
        'ngInject';

        $scope.hasError = false;
        $scope.message = '';
        if (!$stateParams.key) {
            $scope.hasError = true;
            $scope.message = 'Wrong url for registration';
        } else {
            AuthService.activate($stateParams.key)
                .then(function () {
                    $scope.hasError = false;
                    $scope.message = 'Activation was successful';
                })
                .catch(function () {
                    $scope.hasError = true;
                    $scope.message = 'Activation link is not correct';
                });
        }
    }
}