export default class SignUpController {
    constructor($scope, $log, AuthService, vcRecaptchaService) {
        'ngInject';

        $scope.user = {};
        $scope.error = {};

        $scope.showError = function () {
            return $scope.hasError;
        };

        $scope.signUp = function (user, signUpForm) {
            $scope.$broadcast('show-errors-check-validity');
            if (signUpForm.$invalid) {
                $scope.hasError = true;
                $scope.error.message = 'Empty or invalid field!';
                return;
            }

            $scope.hasError = false;
            $scope.success = false;
            $scope.error = {};
            AuthService
                .signUp(user)
                .then(function (data) {
                    if (data.status === "FAIL") {
                        $log.error('error sign up', data);
                        $scope.hasError = true;
                        vcRecaptchaService.reload();
                        $scope.error.message = data.message;
                        $scope.error.status = data.status;
                    } else {
                        $scope.success = true;
                    }
                });
        };
    }
}
