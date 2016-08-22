export default class PasswordResetRequestController {
    constructor($scope, AuthService, vcRecaptchaService) {
        'ngInject';

        $scope.req = {email: "", recaptcha: ""};

        $scope.passwordResetRequest = function () {
            $scope.message = "";
            $scope.hasError = false;
            AuthService
                .passwordResetRequest($scope.req.email, $scope.req.recaptcha)
                .then(function(data) {
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