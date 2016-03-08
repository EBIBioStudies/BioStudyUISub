'use strict';

describe('Checking routing from home', function () {

  //var ptor = protractor.getInstance();
  //console.log('protractor', browser);
  beforeEach(function () {
    browser.get('http://localhost:9999/#/');
  });

  it('should signup with error', function (done) {
    element(by.id('signUpMenuItem')).click().then(function() {

      element(by.model('user.username')).sendKeys('demo');
      element(by.model('user.email')).sendKeys('demo@demo');
      element(by.model('user.login')).sendKeys('demo');
      element(by.model('user.password')).sendKeys('demo');
      element(by.model('user.password2')).sendKeys('demo');
      element(by.id('signUpSubmit')).click().then(function () {
        element(by.id('errorBlock')).getText().then(function(text){
          expect(text).toEqual('Problem with captch!');
          done();
        });
      });
    });
  });


});


