/**
 * Created by mdylag on 04/09/2014.
 */
'use strict';

module.exports = function ($scope, $location, MessageService) {


  $scope.messages = MessageService.getMessages();

};
