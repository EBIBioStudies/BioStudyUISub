import angular from 'angular'
import uibModal from 'angular-ui-bootstrap/src/modal/index-nocss'

import ModalDialogsService from './modalDialogs.service'

export default angular.module('BioStudyApp.Modals', [uibModal])
    .service('ModalDialogs', ModalDialogsService);