export default class SignUpController {
    constructor($scope, $rootScope, AuthService, AUTH_EVENTS) {
        'ngInject';

        $scope.credentials = {};

        $scope.signIn = function () {
            $scope.error = null;

            AuthService
                .signIn($scope.credentials)
                .then(function (data) {
                    if (data.status === "OK") {
                        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, data);
                    } else {
                        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                        $scope.error = {status: "Error", message: data.message};
                    }
                });
        };

        $scope.resetError = function () {
            $scope.error = null;
        };
    }
}