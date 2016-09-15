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
            w.bsst_initThor();
            w.bsst_openOrcidPopup();
        };

        var origin = $location.protocol() + '://' + $location.host() + ':' + $location.port();

        /* getting messages back fro iframe */
        var messageListener = function (e) {
            if (e.origin != origin) {
                return;
            }
            $log.debug('in message listener..');
            var data = angular.fromJson(e.data);
            var orcid = data['orcid-profile']['orcid-identifier']['path'];
            $log.debug('orcid: ' + orcid);

            $timeout(function () {
                $log.debug("in timeout func...");
                $scope.user.orcid = orcid;
            }, 1);
        };

        if ($window.addEventListener) {
            $log.debug('addEventListener(message)');
            $window.addEventListener('message', messageListener, false);
        } else {
            $window.attachEvent('onmessage', messageListener);
        }

        $scope.$on('destroy', function () {
            $log.debug('singUpCtrl: destroy()');
            if ($window.removeEventListener) {
                $log.debug('removeEventListener(message)');
                $window.removeEventListener('message', messageListener, false);
            } else {
                $window.detachEvent('onmessage', messageListener);
            }
        })
    }
}
