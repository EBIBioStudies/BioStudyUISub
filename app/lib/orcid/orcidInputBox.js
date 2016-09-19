class ORCIDInputBoxDirective {
    constructor($log, $document, $timeout, $parse) {

        this.restrict = 'A';
        this.require = '?ngModel';

        this.link = function (scope, element, attrs) {
            var found = element[0].parentNode.querySelector('div.input-group-addon');
            if (!found) {
                $log.debug("orcid icon element not found");
                return;
            }

            var model = attrs.ngModel ? $parse(attrs.ngModel) : null;

            var icon = angular.element(found);

            icon.addClass('orcid-popup');

            icon.on('click', () => {
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
                        if (model) {
                            model.assign(scope, orcid);
                        }
                    }, 1);
                });
            });
        };
    }

    static create($log, $document, $timeout, $parse) {
        'ngInject';
        return new ORCIDInputBoxDirective($log, $document, $timeout, $parse);
    }
}


export default ORCIDInputBoxDirective.create;