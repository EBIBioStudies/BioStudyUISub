export default class SignUpController {
    constructor($scope, $window, $timeout, $document, $location, $log, AuthService, vcRecaptchaService) {
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
            $log.debug('findOrcid(...)');
            var thorIFrame = $document[0].getElementById("thor");
            $log.debug(thorIFrame);

            var w = thorIFrame.contentWindow;
            $log.debug(w);
            w.bsst_openOrcidPopup(function (msg) {
                $log.debug('in message callback..');
                var data = angular.fromJson(msg);
                var orcid = data['orcid-profile']['orcid-identifier']['path'];
                $log.debug('orcid: ' + orcid);

                $timeout(function () {
                    $log.debug("in timeout func...");
                    $scope.user.orcid = orcid;
                }, 1);
            });
        };
    }
}
