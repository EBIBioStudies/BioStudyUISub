/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';


module.exports = function () {
  var messages=[];
  var errors=[];

  this.addMessage = function(text) {
    messages.push({msg : text});
  };
  this.addError = function(error) {
    messages.push(error);
  };
  this.getError = function(error) {
    errors.push(error);
  };


  this.getMessages = function() {
    return messages;
  };
  this.clearMessages= function() {
    messages=[];
  };
  this.clearErrors= function() {
    errors=[];
  };


  this.parseError = function(err) {
    if (typeof err==='string') {
      return 'Theere is a problem with biostudy server';
    }
    return 'Unknown error';
  };

};
