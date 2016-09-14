export default class SignUpController {
    constructor($scope, $interval, $document, $log, AuthService, vcRecaptchaService) {
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
                        $scope.error = {status: data.status, message: data.message};
                        vcRecaptchaService.reload();
                    } else {
                        $scope.success = true;
                    }
                });
        };

        $scope.resetError = function () {
            $scope.error = null;
        };

        $scope.findOrcid = function () {
            $log.debug("findOrcid");
            var thorIFrame = $document[0].getElementById("thor");
            $log.debug(thorIFrame);

            var w = thorIFrame.contentWindow;
            $log.debug(w);

            w.openPopup();

            var promise = $interval(function() {
                $log.debug("(thor) message check...");

                var msg = w.message;
                if (msg === null) {
                    return;
                }
                var data = angular.fromJson(msg);
                var orcid = data['orcid-profile']['orcid-identifier']['path'];
                $log.debug(orcid);

                $scope.user.orcid = orcid;
                $interval.cancel(promise);
            }, 1000); //1 sec

        }
    }
}
