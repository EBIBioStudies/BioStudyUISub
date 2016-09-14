export default class SignUpController {
    constructor($scope, $window, $timeout, $document, $log, AuthService, vcRecaptchaService) {
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

        var messageListener = function(e) {
            $log.debug('in message listener..');
            var data = angular.fromJson(e.data);
            var orcid = data['orcid-profile']['orcid-identifier']['path'];
            $log.debug('orcid: ' + orcid);

            $timeout(function() {
                $log.debug("in timeout func...");
                $scope.user.orcid = orcid;
            }, 1);
        };

        $scope.findOrcid = function () {
            $log.debug('findOrcid(...)');
            var thorIFrame = $document[0].getElementById("thor");
            $log.debug(thorIFrame);

            var w = thorIFrame.contentWindow;
            $log.debug(w);

            $window.addEventListener('message', messageListener);
            w.openPopup();
        };

        $scope.$on('destroy', function() {
            $window.removeEventListener(messageListener);
        })
    }
}
