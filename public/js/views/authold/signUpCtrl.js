/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';

function success() {

}

function error() {

}
module.exports = function ($scope, $location, AuthService) {
    $scope.user={};
    $scope.hasError=false;

    $scope.showError = function() {
        return $scope.hasError;
    };


    $scope.signUp = function(user) {
      if (Recaptcha.get_response()==='') {
        $scope.hasError=true;
        $scope.message='Problem with captch!';
        return;
      }

        if ($scope.form.$invalid) {
          $scope.hasError=true;
          $scope.message='Invalid form';
          return;

        }

      //
        $scope.user.recaptcha_challenge=Recaptcha.get_challenge();
        $scope.user.recaptcha_response= Recaptcha.get_response();

      AuthService.signUp(user).then(function(res, currentUser) {
            $scope.$close('loginok');
            $location.path('/submissions');
            $scope.hasError = false;
            $scope.error = {};
            Recaptcha.reload();

        }).catch(function(error, status){
            $scope.hasError=true;
            $scope.message=error.message;
            Recaptcha.reload();

        });

    };
    function showRecaptcha() {
        Recaptcha.create('6Lcmlv0SAAAAAHofnIcb29l1LMZsnGFcSlH8Reve', 'captcha',
            {
                theme : 'clean',
                callback : Recaptcha.focus_response_field
            });
    }
    showRecaptcha();
};
