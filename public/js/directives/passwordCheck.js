/**
 * Created by mdylag on 04/09/2014.
 */

'use strict';

module.exports = function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.msPasswordCheck;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    var v = elem.val()===angular.element(firstPassword).val();
                    console.log(attrs);
                    ctrl.$setValidity('pwmatch', v);
                });
            });
        }
    };
};
