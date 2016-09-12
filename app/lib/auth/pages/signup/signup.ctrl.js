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
                    if (data.status === "FAIL") {
                        $log.error('error sign up', data);
                        $scope.error = {status: "Error", message: data.message};
                        vcRecaptchaService.reload();
                    } else {
                        $scope.success = true;
                    }
                });
        };

        $scope.resetError = function () {
            $scope.error = null;
        };
    }
}
