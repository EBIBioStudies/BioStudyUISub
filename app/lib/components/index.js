import angular from 'angular'
import { upgradeAdapter } from '../upgrade_adapter';

import AppHeaderComponent from './appHeader/appHeader.component.ts!ts';


export default angular.module('BioStudyApp.Components', [uibDropdown, uibCollapse, appAuth.name])
    .directive('appHeader', upgradeAdapter.downgradeNg2Component(AppHeaderComponent));