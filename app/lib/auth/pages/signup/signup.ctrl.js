export default class SignUpController {
    constructor($scope, $log, AuthService, vcRecaptchaService) {
        'ngInject';

        function transform(obj) {
            var res = {};
            for (var n of ['username', 'email', 'password', 'recaptcha2-response']) {
                res[n] = obj[n] || '';
            }
            res['aux'] = ['orcid:' + (obj.orcid || '')];
            return res;
        }

        $scope.user = {};

        $scope.signUp = function () {
            $scope.success = false;
            $scope.error = null;

            AuthService
                .signUp(transform($scope.user))
                .then(function (data) {
                    if (data.status === 'OK') {
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
