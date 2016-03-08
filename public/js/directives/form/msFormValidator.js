/**
 * Created by mdylag on 28/04/15.
 */
'use strict';
module.exports = function(moduleDirective) {

  function toggleClasses(element, invalid, clazz) {
    element.toggleClass(clazz || 'has-error' , invalid);
  }

  moduleDirective.directive('msFormGroupValidator', function () {
    return {
      restrict: 'A',
      require: ['^form'],
      scope: {},
      link: function (scope, tElement, tAttrs, ctrl) {
        var errMsg, noError;
        var elInput = tElement.find('input');
        var blured = false;
        var triggerVal = 'blur';
        var name = elInput.attr('name');

        if (!elInput || !ctrl[0][name]) {
          return;
        }

        var spanElementsError = [];
        var spanElementsSuccess = [];

        elInput.bind(triggerVal, function (e) {
          blured = true;
          return toggleClasses(tElement, ctrl[0][name].$invalid);
        });

        elInput.bind('focus', function () {
          scope.$broadcast('reset-form-error', 'focus');
        });
          scope.$watch(function () {
            return ctrl[0] && ctrl[0][name].$invalid;
          }, function (invalid) {
            //if (ctrl[0].$dirty) {
              toggleClasses(tElement, invalid);
            //}
          });

        scope.$on('show-errors-check-validity', function () {
          ctrl[0][name].$setDirty();
          return toggleClasses(tElement, ctrl[0][name].$invalid);
        });

      }
    };
  });

  moduleDirective.directive('msFormMsg', function () {
    return {
      restrict: 'A',
      require: ['^form'],
      scope: {
        type: '@',
        forField: '='
      },
      link: function (scope, tElement, tAttrs, ctrl) {

        //check it
      }
    };
  });


  moduleDirective.directive('msInputVal', function () {
    return {
      restrict: 'A',
      require: ['^form', 'ngModel'],
      link: function (scope, tElement, tAttrs, ctrl) {
        //var elInput=tElement.children()[0];
        var elFormControll = tElement.parent();
        var blured = false;
        var triggerVal = tAttrs.triggerVal || 'blur';
        var checkPristine = tAttrs.checkPristine || false;
        console.log("pristine",tAttrs.checkPristine);
        tElement.bind(triggerVal, function (e) {
          blured = true;
          return toggleClasses(elFormControll, ctrl[1].$invalid);
        });
        tElement.bind('focus', function () {
          scope.$broadcast('reset-form-error', 'focus');
        });
        scope.$watch(function () {
          return ctrl[1] && ctrl[1].$invalid;
        }, function (invalid) {
          if (tAttrs.checkPristine || (tAttrs.checkPristine && ctrl[1].$dirty)) {
            toggleClasses(elFormControll, invalid);
          }
        });

        scope.$on('show-errors-check-validity', function () {
          return toggleClasses(elFormControll, ctrl[1].$invalid);
          //return toggleClasses(formCtrl[inputName].$invalid);
        });


      }
    };
  });
  moduleDirective.directive('msCheckValidity', function () {
    return {
      restrict: 'A',
      require: ['^form'],
      link: function (scope, tElement, tAttrs, ctrl) {
        scope.$on('show-errors-check-validity', function () {
          //tAttrs.errorClass;

          toggleClasses(tElement, ctrl[0].$invalid, tAttrs.errorClass);
          toggleClasses(tElement, ctrl[0].$valid, tAttrs.defaultClass);
          scope.$watch(ctrl[0].$invalid, function() {
            toggleClasses(tElement, ctrl[0].$invalid, tAttrs.errorClass);
            toggleClasses(tElement, ctrl[0].$valid, tAttrs.defaultClass);

          });

          console.log('check validity', tAttrs.errorClass, ctrl[0]);
        });
      }
    }
  });
};

