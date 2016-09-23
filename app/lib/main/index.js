import angular from 'angular'
import uibDropdown from 'angular-ui-bootstrap/src/dropdown/index-nocss'

import appAuth from '../auth/index'

import MainCtrl from './main.ctrl'
import ErrorCtrl from './error.ctrl'

import BsActiveNavDirective from './directives/bsActiveNav'

export default angular.module('BioStudyApp.Main', [uibDropdown, appAuth.name])
    .controller('MainCtrl', MainCtrl)
    .controller('ErrorCtrl', ErrorCtrl)
    .directive('bsActiveNav', BsActiveNavDirective);
