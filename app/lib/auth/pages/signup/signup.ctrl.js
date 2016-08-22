export default class SignUpController {
    constructor($scope, $log, AuthService, vcRecaptchaService) {
        'ngInject';

        $scope.user = {};

        $scope.signUp = function (user) {
            $scope.success = false;
            $scope.error = null;
            AuthService
                .signUp(user)
                .then(function (data) {
                    if (data.status === "FAIL") {
                        $log.error('error sign up', data);
                        $scope.error = {status: data.status, message: data.message};
                        vcRecaptchaService.reload();
                    } else {
                        $scope.success = true;
                    }
                });
        };

        $scope.userInputChanged = function () {
            $scope.error = null;
        };
    }
}
