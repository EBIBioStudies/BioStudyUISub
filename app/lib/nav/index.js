import angular from 'angular'
import {upgradeAdapter} from '../upgrade_adapter';

import {AppHeaderComponent} from './header/header.component.ts!ts';


export default angular.module('BioStudyApp.Nav', [])
    .directive('appHeader', upgradeAdapter.downgradeNg2Component(AppHeaderComponent));