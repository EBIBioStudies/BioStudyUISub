/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';

module.exports = function ($scope, $location, AuthService, vcRecaptchaService ) {
    $scope.user={};
    $scope.error={};
    $scope.hasError=false;
    $scope.success = false;
    $scope.showError = function() {
        return $scope.hasError;
    };


    $scope.signUp = function(user, signUpForm) {
        $scope.$broadcast('show-errors-check-validity');
      if (signUpForm.$invalid) {
            $scope.hasError=true;
            $scope.error.message='Empty or invalid field!';
            return;
      }


      AuthService.signUp(user).then(function(res) {
            //$location.path('/subm');
            $scope.hasError = false;
            $scope.error = {};
            console.log("Success sign up", res);
            if (res.serverStatus!==200) {
                $scope.hasError = false;
                $scope.error.message =res.message;
                $scope.error.status = res.status;

            } else {
                $scope.success = true;
            }
          //grecaptcha.reset();

        }).catch(function(error, status){
          //grecaptcha.reset();
          $scope.hasError=true;
          vcRecaptchaService.reload();
            console.log('error sign up', error);
            if (error) {
                $scope.error.message=error.message;
                $scope.error.status=error.status;
            }

        });

    };
    /*function showRecaptcha() {
        grecaptcha.create('6Lcmlv0SAAAAAHofnIcb29l1LMZsnGFcSlH8Reve', 'captcha',
            {
                theme : 'clean',
                callback : Recaptcha.focus_response_field
            });
    }
    //showRecaptcha();*/
};
