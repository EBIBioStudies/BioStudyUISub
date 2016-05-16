/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';

function success() {

}

function error() {

}
module.exports = function ($scope, AuthService) {
  $scope.user = {};
  $scope.hasError = false;

  $scope.isFormInvalid = function () {
    if (Recaptcha.get_response() === '') {
      return true;
    }
    return $scope.form.$invalid;
  };

  $scope.signUp = function (user) {
    //
    if ($scope.form.$invalid) {

    }
    $scope.user.recaptcha_challenge = Recaptcha.get_challenge();
    $scope.user.recaptcha_response = Recaptcha.get_response();

    AuthService.signUp(user, $scope);
    //call signup and redirect to sign in
  };
  function showRecaptcha() {
    Recaptcha.create('6Lcmlv0SAAAAAHofnIcb29l1LMZsnGFcSlH8Reve', 'captcha',
      {
        theme: 'clean',
        callback: Recaptcha.focus_response_field
      });
  }

  showRecaptcha();
};
