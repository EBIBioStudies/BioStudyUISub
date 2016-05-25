'use strict';

angular.module('BioStudyApp')
    .controller('AppCtrl', require('./views/app.ctrl'))
    .controller('HomeCtrl', require('./views/home.ctrl'))
    .controller('HelpCtrl', require('./views/help.ctrl'))
    .factory('ModalDialogs', require('./modalDialogs.service'));

