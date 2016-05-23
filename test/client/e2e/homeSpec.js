'use strict';

describe('Test home page and menu', function() {

    //var ptor = protractor.getInstance();
    //console.log('protractor', browser);
    beforeEach(function() {
        browser.get('http://localhost:9999/#/home');
    });

    it('should click the menu Sign in', function() {
        element(by.id('signInMenuItem')).click().then(function() {
            expect(element(by.model('userForm.login'))).toBeDefined();
            expect(element(by.model('userForm.password'))).toBeDefined();
        });
      /*element(by.id('signInBtn')).click().then(function() {
          expect(browser.getCurrentUrl()).toBe('http://localhost:9999/signin');
      });*/
  });
    it('should click the menu Sign Up', function() {
        element(by.id('signUpMenuItem')).click().then(function() {
            expect(element(by.model('user.email'))).toBeDefined();
            expect(element(by.model('user.password'))).toBeDefined();
            expect(element(by.model('user.username'))).toBeDefined();
            expect(element(by.model('user.login'))).toBeDefined();
            expect(element(by.id('captcha'))).toBeDefined();

        });
    });
    it('should click the menu help', function() {
        element(by.id('helpMenuItem')).click().then(function() {
            expect(browser.getCurrentUrl()).toBe('http://localhost:9999/#/help');


        });
    });


});


