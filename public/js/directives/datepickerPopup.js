/**
 * Created by mdylag on 04/09/2014.
 */

'use strict';

module.exports = function () {
    return {
        restrict: 'EAC',
        require: 'ngModel',
        link: function(scope, element, attr, controller) {
            //remove the default formatter from the input directive to prevent conflict
            controller.$formatters.shift();
        }
    };
};
