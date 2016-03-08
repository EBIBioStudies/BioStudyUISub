'use strict';
var angularHelper = require('../../tests/angularHelper');
var views=require('../../config/config.json').views;
var roleConfig= require('../../roleConfig');
var elHtml = require('./msFormValidator.TestTemplate');

describe('should test msFormGroupValidator directive', function () {
  var ctrl, Auth, _$scope, $locationSpy, $location, $compile;
  beforeEach(function() {
    angular.mock.module('acext');
    angularHelper.mockServices();
  });
  beforeEach(angular.mock.inject(function ($injector) {
    angularHelper.init($injector);

    _$scope = angularHelper.$rootScope.$new();
    $location = $injector.get('$location');
    $compile= $injector.get('$compile');
  }));

  it('should validate ', function () {
    // Compile a piece of HTML containing the directive
    var element = $compile(elHtml)(_$scope);
    // fire all the watches, so the scope expression {{1 + 1}} will be evaluated
    angularHelper.$rootScope.$digest();
    //console.log(element.html(),_$scope.signInForm';''';'');
    // Check that the compiled element contains the templated content
    //expect(element.html()).toContain('style=\"display: none;\"');
  });


});
