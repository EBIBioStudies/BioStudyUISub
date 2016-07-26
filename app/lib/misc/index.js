import angular from 'angular'
import uibModal from 'angular-ui-bootstrap/src/modal/index-nocss'

import ModalDialogsService from './modalDialogs.service'

export default angular.module('BioStudyApp.Modals', [uibModal])
   //.controller('AppCtrl', require('./views/app.ctrl'))
   // .controller('HomeCtrl', require('./views/home.ctrl'))
   // .controller('HelpCtrl', require('./views/help.ctrl'))
    .service('ModalDialogs', ModalDialogsService);

