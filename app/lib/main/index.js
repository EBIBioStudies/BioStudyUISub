import angular from 'angular'
import uibDropdown from 'angular-ui-bootstrap/src/dropdown/index-nocss'
import uibCollapse from 'angular-ui-bootstrap/src/collapse/index'

import appAuth from '../auth/index'

import ErrorCtrl from './error.ctrl'


import BsActiveNavDirective from './directives/bsActiveNav'
import appHeaderDirective from './directives/appHeader'

export default angular.module('BioStudyApp.Main', [uibDropdown, uibCollapse, appAuth.name])
    .controller('ErrorCtrl', ErrorCtrl)
    .directive('bsActiveNav', BsActiveNavDirective)
    .directive('appHeader', appHeaderDirective);
