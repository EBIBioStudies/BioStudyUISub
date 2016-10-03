export default class ResendActivationLinkController {
    constructor($scope, AuthService, vcRecaptchaService) {
        'ngInject';

        $scope.req = {email: "", recaptcha: ""};

        $scope.resendActivationLink = function () {
            $scope.message = "";
            $scope.hasError = false;
            AuthService
                .resendActivationLink($scope.req.email, $scope.req.recaptcha)
                .then(function (data) {
                    if (data.status === "OK") {
                        $scope.showSuccess = true;
                    }
                    else {
                        $scope.hasError = true;
                        $scope.message = data.message;
                        vcRecaptchaService.reload();
                    }
                });
        }
    }
}