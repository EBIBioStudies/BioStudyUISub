/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';

module.exports = function ($scope, $location, AuthService ) {
    $scope.user={};
    $scope.error={};
    $scope.hasError=false;

    $scope.showError = function() {
        return $scope.hasError;
    };


    $scope.signUp = function(user) {
        $scope.$broadcast('show-errors-check-validity');
      if (grecaptcha.getResponse()==='' || $scope.signUpForm.$invalid) {
        $scope.hasError=true;
        $scope.error.message='Empty or invalid field!';
        return;
      }


      AuthService.signUp(user).then(function(res, currentUser) {
            $location.path('/submissions');
            $scope.hasError = false;
            $scope.error = {};
          grecaptcha.reset();

        }).catch(function(error, status){
            $scope.hasError=true;
            console.log('error', error);
            if (error) {
                $scope.error.message=error.message;
                $scope.error.status=error.status;
            }

        });

    };
    function showRecaptcha() {
        grecaptcha.create('6Lcmlv0SAAAAAHofnIcb29l1LMZsnGFcSlH8Reve', 'captcha',
            {
                theme : 'clean',
                callback : Recaptcha.focus_response_field
            });
    }
    //showRecaptcha();
};
