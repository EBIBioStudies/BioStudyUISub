'use strict';

var config = require('../../../../.gen/config.json');
var helper=require('../angularHelper');

describe('Test MessageService', function () {
  var messageService;
  beforeEach(angular.mock.module('app'));

  beforeEach(angular.mock.inject(function ($injector) {
    helper.init($injector);
    messageService = $injector.get('MessageService');

  }));
  afterEach(function () {
  });


  it('should create a service', angular.mock.inject(function ($httpBackend, $injector) {
    expect(messageService).toBeDefined();
    expect(messageService.addMessage).toBeDefined();
    expect(messageService.clearMessages).toBeDefined();
    expect(messageService.setErrorType).toBeDefined();
    expect(messageService.isErrorType).toBeDefined();
    expect(messageService.isSuccessType).toBeDefined();
  }));

  it('should set and clear message', angular.mock.inject(function ($httpBackend, $injector) {
    messageService.addMessage('Message text');
    expect(messageService.getMessages()).toContain({msg :'Message text'});
    messageService.clearMessages();
    expect(messageService.getMessages()).toEqual([]);

  }));

  it('should set type error', angular.mock.inject(function ($httpBackend, $injector) {
    messageService.setErrorType();
    expect(messageService.isErrorType()).toBe(true);
    expect(messageService.getType()).toEqual('danger');

  }));

  it('should set type success', angular.mock.inject(function ($httpBackend, $injector) {
    messageService.setSuccessType();
    expect(messageService.isSuccessType()).toBe(true);
    expect(messageService.getType()).toEqual('success');

  }));

});