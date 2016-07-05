/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';

module.exports = function ($rootScope, $scope, $log,EuropePmc) {
    $log.debug('Europe PMC');

    $scope.test = function() {
        $log.debug('test');
        EuropePmc.get(78184);
    };
};
