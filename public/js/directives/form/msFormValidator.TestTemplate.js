module.exports=
'<form id="login-form" novalidate name="signInForm" role="form" ' +
'style="display: block;"> ' +
'<div class="form-group" ms-form-group-validator> ' +
'<input type="text" name="name" id="name" tabindex="1" class="form-control"' +
'placeholder="Username" value="" ng-model="user.name" ng-required="true"> ' +
'<span class="help-block-xs" ' +
'ng-show="signInForm.name.$dirty && signInForm.name.$invalid && signInForm.name.$error.required">' +
'Username is requi red.'+
'                                </span>'+
'                                <span class="help-block-empty-xs"'+
'                                      ng-show="signInForm.name.$valid || signInForm.name.$pristine">'+
'                                    &nbsp;'+
'                                </span>'+
'    </div>' +
'</form>';