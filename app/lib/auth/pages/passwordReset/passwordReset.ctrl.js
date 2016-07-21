export default class PasswordResetController {
    constructor($scope, $log, $stateParams, AuthService, vcRecaptchaService) {
        'ngInject';

        $scope.password1 = "";
        $scope.password2 = "";
        $scope.recaptcha = "";

        $scope.resetPassword = function () {
            if ($scope.password1 !== $scope.password2) {
                $log.error("password validation broken. Passwords do not match.");
                return;
            }
            if ($scope.password1.length < 6) {
                $log.error("password length validation broken. 6 chars is a minimum");
                return;
            }
            $scope.hasError = false;
            $scope.message = "";
            AuthService
                .passwordReset($stateParams.key, $scope.password1, $scope.recaptcha)
                .then(function (data) {
                    $log.debug(data);
                    if (data.status === "FAIL") {
                        $scope.hasError = true;
                        $scope.message = data.message;
                        vcRecaptchaService.reload();
                    } else {
                        $scope.showSuccess = true;
                    }
                });
        }
    }
}