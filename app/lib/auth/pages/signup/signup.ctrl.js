export default class SignUpController {
    constructor($scope, $timeout, $document, $log, AuthService, vcRecaptchaService) {
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

            var unbind = w.addCallback(function(msg) {
                var data = angular.fromJson(msg);
                var orcid = data['orcid-profile']['orcid-identifier']['path'];
                $log.debug(orcid);

                /* workaround to update model and form values ASAP */
                var promise = $timeout(function() {
                    $log.debug("on timeout: user.orcid=" + orcid);
                    $scope.user.orcid = orcid;
                    $timeout.cancel(promise);
                }, 1);
                unbind();
            });
            w.openPopup();
        }
    }
}
