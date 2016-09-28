export default class SignUpController {
    constructor($scope, $log, AuthService, vcRecaptchaService) {
        'ngInject';

        $scope.user = {};

        $scope.signUp = function () {
            $scope.success = false;
            $scope.error = null;
            AuthService
                .signUp($scope.user)
                .then(function (data) {
                    if (data.status === "OK") {
                        $scope.success = true;
                    } else {
                        $log.error('error sign up', data);
                        $scope.error = {status: 'Error', message: data.message};
                        vcRecaptchaService.reload();
                    }
                });
        };

        $scope.resetError = function () {
            $scope.error = null;
        };
    }
}
