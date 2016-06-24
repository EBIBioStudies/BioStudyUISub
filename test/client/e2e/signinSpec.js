'use strict';

describe('Checking routing from home', function () {

  //var ptor = protractor.getInstance();
  //console.log('protractor', browser);
  beforeEach(function () {
    browser.get('http://localhost:9999/#/');
  });

  it('should signin with success', function () {
    element(by.id('signInMenuItem')).click().then(function() {

      element(by.model('userForm.login')).sendKeys('demo');
      element(by.model('userForm.password')).sendKeys('demo');
      element(by.id('signInSubmit')).click().then(function () {
          var el=element(by.id('submissionMenuItem'));
          console.log('login',el);
          expect(browser.getCurrentUrl()).toBe('http://localhost:9999/#/submissions');
            //submission
            //files
      });
    });
  });
  it('should signin with error', function () {
    element(by.id('signInMenuItem')).click().then(function() {

      element(by.model('userForm.login')).sendKeys('demo');
      element(by.model('userForm.password')).sendKeys('demo');
      element(by.id('signInSubmit')).click().then(function () {
      });
    });
  });


});


