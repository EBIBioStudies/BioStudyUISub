import angular from 'angular'
import uibDropdown from 'angular-ui-bootstrap/src/dropdown/index-nocss'
import uibCollapse from 'angular-ui-bootstrap/src/collapse/index'

import appAuth from '../auth/index'

import ErrorCtrl from './error.ctrl'


import BsActiveNavDirective from './directives/bsActiveNav'

import {upgradeAdapter} from '../upgrade_adapter';

import {AppHeaderComponent} from './header/header.component.ts!ts';

export default angular.module('BioStudyApp.Main', [uibDropdown, uibCollapse, appAuth.name])
    .controller('ErrorCtrl', ErrorCtrl)
    .directive('bsActiveNav', BsActiveNavDirective)
    .directive('appHeader', upgradeAdapter.downgradeNg2Component(AppHeaderComponent));